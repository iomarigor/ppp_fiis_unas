import React,{useState, useEffect} from 'react';
import {Modal, Button, Container, Row, Col, Form,InputGroup,Badge} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { connect } from "react-redux";
import { DataGrid} from '@material-ui/data-grid';
import withDragDropContext from "../helper/withDnDContext";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import Select from 'react-select';
import * as Actions from "store/actions/app";
import NewCustomerForm from "../../grid/form/new_custtomer.form";
const ProformaModal= (props)=>{
    const dispatch = useDispatch();
    const [search, setSearch]= useState("");
    const [rowsDetailSelect,setRowsDetailSelect]= useState([]);
    const [paySelectAll,setPaySelectAll]=useState(false);
    const [consumptionSelect, setConsumptionSelect]= useState(false);
    const initialsStateValues={
        doc_identidad:null,
        razon_social:null,
        direccion: null,
        comprobante:0,
        serie:0,
        numero:null,
        tipo_pago:0,
        forma_pago:0,
        fecha_emision:"",
        correlativo:"",
        moneda:0,
        efectivo:null,
        vuelto:null,
        numero_operacion:"",
        observacion:"",
        //
        
    }
    
    const [values, setValues] = useState(initialsStateValues);
    const[rows, setRows]= useState([]);
    const[rowsDetail, setRowsDetail]= useState([]);

    //consulta los registros de proformas
    useEffect(()=>{
        if(props.statusModal){
            props.getListProformas();
        }
    },[props.statusModal]);
    
    //se inicializan las columnas de las proformas
    const columns=[
        {
            field: '',
            headerName:'Acciones',
            headerAlign:'center',
            width:140,
            disableClickEventBuddling: true,            
            renderCell: (params)=>{
                
                //Elimina producto
                const onClickDetail=()=>{
                    const thisRow=params.row;
                    props.getDetailProformas(thisRow.id);
                    setConsumptionSelect(thisRow);
                }
                if(params.row.detalleCant>0){
                    return  <>
                                <Button onClick={onClickDetail} className="ml-3" variant="primary">Ver detalle</Button>

                            </>;
                }else{
                    return  <>                            
                        <Button onClick={onClickDetail} className="ml-3" variant="secondary" data-toggle="tooltip" data-placement="right" title="Los items de proforma ya fueron facturados">Facturado</Button>
                    </>;
                }
                
            }
        },
        {field: 'id', hide:true, identify: true},
        {field: 'fecha_emision', headerName:'Fecha Check out', headerAlign:'center', width:180},
        {field: 'razon_social_nombre', headerName:'Cliente', headerAlign:'center', flex:1},
        {field: 'numero_documento', headerName:'Documento', headerAlign:'center', type:'number', width:150},
        {field: 'total_neto', headerName:'Importe', headerAlign:'center', type:'number', width:150},
    ];

    //se inicializan los datalle de las proformas
    const columnsDetails=[
        {
            field: '',
            headerName:'Acciones',
            headerAlign:'center',
            width:110,
            disableClickEventBuddling: true,            
            renderCell: (params)=>{
                //se selecciona el detalle
                const onClickCheck=()=>{
                    const thisRow=params.row;
                    if(thisRow.select!=null){
                        thisRow.select=!thisRow.select;
                    }
                    if(thisRow.select){
                        const tValues={
                            id:'PF-'+thisRow.id_proforma+'-'+thisRow.id_producto+'-'+thisRow.unidad_medida_id,
                            codigo_producto:thisRow.id_producto,
                            unidad_medida_id:thisRow.abreviatura,
                            precio_venta: parseFloat(thisRow.precio_venta),
                            denominacion:thisRow.denominacion,
                            cantidad: parseInt(thisRow.cantidad),
                            importe: parseFloat(thisRow.sub_total),
                            descuento:0,
                            persona_id:consumptionSelect.persona_id
                        }
                        setRowsDetailSelect([...rowsDetailSelect, tValues]);
                    }else{
                        setRowsDetailSelect(rowsDetailSelect.filter((rowConsum)=>{return rowConsum.id!=='PF-'+thisRow.id_proforma+'-'+thisRow.id_producto}));
                    }
                }
                if(params.row.estado_facturacion===1){
                    return  <> <Button onClick={()=>{toast.error("Item ya fue facturado");}} className="ml-3" variant="warning"><i className="fas fa-clipboard-check" data-toggle="tooltip" data-placement="right" title="Item ya facturado"></i></Button></>;

                }else{
                    if(params.row.select!==null){
                        if(params.row.select){
                            return  <> <Button onClick={onClickCheck} className="ml-3" variant="primary"><i className="fas fa-check-square"></i></Button></>;
        
                        }else{
                            return  <> <Button onClick={onClickCheck} className="ml-3" variant="primary"><i className="far fa-check-square"></i></Button></>;
                        }
                    }else{
                        return  <> <Button onClick={()=>{toast.error("Item ya fue agregado");}} className="ml-3" variant="warning"><i className="fas fa-check-square"></i></Button></>;
                    }
                }
                
            }
        },
        {field: 'id', hide:true, identify: true},
        {field: 'cantidad', headerName:'Cantidad', headerAlign:'center', type:'number', width:95},
        {field: 'abreviatura', headerName:'Unidad de medida', headerAlign:'center', width:150},
        {field: 'denominacion', headerName:'Descripción', headerAlign:'center', flex:1},
        {field: 'precio_venta', headerName:'Precio', headerAlign:'center', type:'number', width:80},
        {field: 'sub_total', headerName:'Importe', headerAlign:'center', type:'number', width:150},
    ];
    function handleSubmit(e){
        e.preventDefault();
        setValues(initialsStateValues);
        rows=[];
        props.hideModal();
    }
    const hideModal=()=>{
        setValues(initialsStateValues);
        props.hideModal();
        setRows([]);
        setRowsDetail([]);
    };
    useEffect(()=>{
        if(props.list_proformas&& props.list_proformas!==[]){
            if(localStorage.getItem("arraySales")===null ){
                setRows(props.list_proformas.map(p => {
                    //p.id = p.pedido_nota_consumo_maestro_id;
                    return p;
                }));
            }else{
                setRows(props.list_proformas.filter(p=>p.id=== parseInt(JSON.parse(localStorage.getItem("arraySales"))[0].id.split('-')[1])).map(p => {
                    //p.id = p.pedido_nota_consumo_maestro_id;
                    return p;
                }));
                setConsumptionSelect(props.list_proformas.filter(p=>p.id=== parseInt(JSON.parse(localStorage.getItem("arraySales"))[0].id.split('-')[1])).map(p => {
                    //p.id = p.pedido_nota_consumo_maestro_id;
                    return p;
                })[0]);
                props.getDetailProformas(JSON.parse(localStorage.getItem("arraySales"))[0].id.split('-')[1]);
            }
            
        }        
    },[props.list_proformas]);
   
    //asigna los detalles del la proforma selecionada al datagrid de detalles
    useEffect(()=>{
        if(props.detail_proforma!=={} && props.detail_proforma.detalle){
            setRowsDetail(props.detail_proforma.detalle.map(p => {
                let i=0;
                p.id= p.id+'-'+p.unidad_medida_id;
                if(localStorage.getItem("arraySales")!==null){
                    JSON.parse(localStorage.getItem("arraySales")).map((sales)=>{
                        if(('PF-'+p.id_proforma+'-'+p.id_producto+'-'+p.unidad_medida_id)===sales.id){
                            i++;
                        }
                    })
                }
                
                if(i===0){
                    p.select=false;
                }else{
                    p.select=null;                    
                }
                return p;
            }));
        }
    },[props.detail_proforma]);

    //filtra las proformas segun el valor de search
    function filter (rows){
        return rows.filter(
            (row)=>row.razon_social_nombre.toLowerCase().indexOf(search.toLowerCase())>-1
        );
    }
    
    //Se agregan los datalles al array para pazar al datagrid del componente padre y luego facturar
    const detailsSelectAll=()=>{
        setPaySelectAll(!paySelectAll);
        if(!paySelectAll){
            setRowsDetail(rowsDetail.map(p=>{
                //p.id= p.pago_id;
                if(p.estado_facturacion===0){
                    if(p.select===false){
                        p.select=true;
                    }
                }
                return p;
            }));
            const tConsumoSelect=[];
            rowsDetail.map((row)=>{
                if(row.estado_facturacion===0){
                    if(row.select===true || row.select===false){
                        const tRow={
                            id:'PF-'+row.id_proforma+'-'+row.id_producto+'-'+row.unidad_medida_id,
                            codigo_producto:row.id_producto,
                            unidad_medida_id:row.abreviatura,
                            precio_venta: parseFloat(row.precio_venta),
                            denominacion:row.denominacion,
                            cantidad: parseInt(row.cantidad),
                            importe: parseFloat(row.sub_total),
                            descuento:0,
                            persona_id:consumptionSelect.persona_id
                        }
                        tConsumoSelect.push(tRow);
                    }
                }
            });
            setRowsDetailSelect(tConsumoSelect);
        }else{
            /* console.log(props.detail_proforma.detalle); */
            setRowsDetail(props.detail_proforma.detalle.map(p=>{
                /* p.id = p.id_producto; */
                if(p.estado_facturacion===0){
                    if(p.select===true){
                        p.select=false;
                    }
                }
                return p;
            }));
            setRowsDetailSelect([]);
        }
    }
    const addConsumptionRecord=()=>{
        if((rowsDetailSelect.length)>0){
            
            props.addProductReservation(rowsDetailSelect);
            dataReset();
            hideModal();
            props.proformaSelect();
        }else{
            toast.error("Aun no se seleccionó ningun item");
        }
    }
    const dataReset=()=>{
        setRowsDetailSelect([]);
        //setRowsPaySelect([]);
        setPaySelectAll(false);
        //setConSelectAll(false);
        setRowsDetail([]);
        //setRowsPay([]);
        setRows([]);
        setConsumptionSelect(null);
    }
    return (
        <div>
            <Modal size="xl" show={props.statusModal} onHide={hideModal} centered>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title className="ml-3">Proforma</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                        <Container>
                            <div className="row justify-content-end">
                                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-6 form-inline my-2 my-lg-0">
                                    <label className="form-label mr-2" htmlFor="search">Ingresar criterio de busqueda:</label>
                                    <input className="form-control" style={{"width": "55%"}} id="search"  type="search" value={search} onChange={(e)=>setSearch(e.target.value)}/>
                                </div>
                            </div>
                            <Row>
                                <div style={{ height:200, width:"100%"}} className="mt-2">
                                    <DataGrid onRowClick={({row})=>{console.log(row);}} rows={filter(rows)} columns={columns} pageSize={2} hideFooterSelectedRowCount={true} rowHeight={45} disableColumnMenu={true}/>
                                </div>
                            </Row>
                            <Row className="d-flex justify-content-between mt-3">
                                <Col> <strong>Detalles</strong> </Col>
                                {(rowsDetail.length>0)? <Col className="d-flex justify-content-end"><Button  onClick={detailsSelectAll} variant="success" className="mr-3">{(paySelectAll)? <i className="fas fa-check-square"/>:<i className="far fa-check-square"/>}</Button></Col>:<></>}
                            </Row>
                            <Row>
                                <div style={{ height:200, width:"100%"}} className="mt-2">
                                    <DataGrid onRowClick={({row})=>{console.log(row);}} rows={rowsDetail} columns={columnsDetails} pageSize={2} hideFooterSelectedRowCount={true} rowHeight={45} disableColumnMenu={true}/>
                                </div>
                            </Row>
                            <Row className="mt-3">
                                <Col className="d-flex justify-content-end">
                                    <Button  variant="success" onClick={addConsumptionRecord}/* className="mr-3" */>Agregar</Button>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                </form>
            </Modal>
        </div>
    );
}
const mapStateToProps = state => {
    return {
        list_proformas: state.app.proformas.list_proformas,
        detail_proforma: state.app.proformas.detail_proforma,
    };
};
const mapDispatchToProps = dispatch => {
    return {
        getListProformas:()=>dispatch(Actions.getListProformas()),
        getDetailProformas: (idProforma)=>dispatch(Actions.getDetailProformas(idProforma)) ,
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withDragDropContext(ProformaModal));