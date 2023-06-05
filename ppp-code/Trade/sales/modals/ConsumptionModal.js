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
const ConsumptionModal= (props)=>{
    const dispatch = useDispatch();
    const [search, setSearch]= useState("");
    const [rowsDetailSelect,setRowsDetailSelect]= useState([]);
    const [paySelectAll,setPaySelectAll]=useState(false);

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

    //se consultan los registros de ordenes
    useEffect(()=>{
        if(props.statusModal){
            dataReset();
            props.getListOrders();
        }
    },[props.statusModal]);
    const[rows, setRows]= useState([]);
    const[rowsDetail, setRowsDetail]= useState([]);
    const[consumptionSelect, setConsumptionSelect]= useState(null);
    //se inicializan las columnas de ordenes
    const columns=[
        {
            field: '',
            headerName:'Acciones',
            headerAlign:'center',
            width:140,
            disableClickEventBuddling: true,            
            renderCell: (params)=>{
                
                //datalles orden
                const onClickDetail=()=>{
                    const thisRow=params.row;
                    setConsumptionSelect(thisRow);
                    props.getDetailOrders(thisRow.id);
                }
                if(params.row.detalleCant>0){
                    return  <>
                                <Button onClick={onClickDetail} className="ml-3" variant="primary">Ver detalle</Button>

                            </>;
                }else{
                    return  <>                            
                                <Button onClick={onClickDetail} className="ml-3" variant="secondary" data-toggle="tooltip" data-placement="right" title="Los items de consumo ya fueron facturados">Facturado</Button>
                            </>;
                }
                
            }
        },
        {field: 'id', hide:true, identify: true},
        {field: 'fecha_emision', headerName:'Fecha Check out', headerAlign:'center', width:180},
        {field: 'cliente', headerName:'Cliente', headerAlign:'center', flex:1},
        {field: 'numero_habitacion', headerName:'Habitación', headerAlign:'center', width:150},
        {field: 'importe', headerName:'Importe', headerAlign:'center', type:'number', width:150},
    ];

    //se inicializan las columnas de detalle de orden
    const columnsDetails=[
        {
            field: '',
            headerName:'Acciones',
            headerAlign:'center',
            width:110,
            disableClickEventBuddling: true,            
            renderCell: (params)=>{
                
                //seleciona producto de orden 
                const onClickCheck=()=>{
                    const thisRow=params.row;
                    if(thisRow.select!=null){
                        thisRow.select=!thisRow.select;
                    }

                    if(thisRow.select){
                        const tValues={
                            id:'PC-'+thisRow.pedido_nota_consumo_maestro_id+'-'+thisRow.producto_id+'-'+thisRow.unidad_medida_id+'-'+consumptionSelect.reserva_estancia_id,
                            codigo_producto:thisRow.producto_id,
                            unidad_medida_id:thisRow.abreviatura,
                            precio_venta: parseFloat(thisRow.precio_unitario),
                            denominacion:thisRow.denominacion,
                            cantidad: parseInt(thisRow.cantidad),
                            importe: parseFloat(thisRow.sub_total),
                            descuento:0,
                            persona_id:consumptionSelect.persona_id
                        }
                        setRowsDetailSelect([...rowsDetailSelect, tValues]);
                    }else{
                        setRowsDetailSelect(rowsDetailSelect.filter((rowConsum)=>{return rowConsum.id!=='PC-'+thisRow.producto_id}));
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
        {field: 'abreviatura', headerName:'Unidad de medida', headerAlign:'center', width:120},
        {field: 'denominacion', headerName:'Descripción', headerAlign:'center', flex:1},
        {field: 'precio_unitario', headerName:'Precio', headerAlign:'center', type:'number', width:80},
        {field: 'sub_total', headerName:'Importe', headerAlign:'center', type:'number', width:150},
    ];
    function handleSubmit(e){
        e.preventDefault();
        setValues(initialsStateValues);
        rows=[];
        props.hideModal();
        setRowsDetail([]);
    }
    const hideModal=()=>{
        setValues(initialsStateValues);
        props.hideModal();
        
        setRows([]);
        setRowsDetail([]);
    };

    // se asignan las ordenes al data gris de ordenes
    useEffect(()=>{
        if(props.list_orders&& props.list_orders!==[]){
            if(localStorage.getItem("arraySales")===null ){
                setRows(props.list_orders.map(p => {
                    p.id = p.pedido_nota_consumo_maestro_id;
                    return p;
                }));
            }else{
                setRows(props.list_orders.filter(p=>p.pedido_nota_consumo_maestro_id=== parseInt(JSON.parse(localStorage.getItem("arraySales"))[0].id.split('-')[1])).map(p => {
                    p.id = p.pedido_nota_consumo_maestro_id;
                    return p;
                }));
                setConsumptionSelect(props.list_orders.filter(p=>p.pedido_nota_consumo_maestro_id=== parseInt(JSON.parse(localStorage.getItem("arraySales"))[0].id.split('-')[1])).map(p => {
                    p.id = p.pedido_nota_consumo_maestro_id;
                    return p;
                })[0]);
                props.getDetailOrders(JSON.parse(localStorage.getItem("arraySales"))[0].id.split('-')[1]);
            }
        }        
    },[props.list_orders]);
   
    // se asignan los detalle ordenes al data gris de ordenes detalle
    useEffect(()=>{
        if(props.detail_order!=={} && props.detail_order.detalle){
            console.log(props.detail_order);
            setRowsDetail(props.detail_order.detalle.map(p => {
                let i=0;
                p.id= p.producto_id+'-'+p.unidad_medida_id;
                if(localStorage.getItem("arraySales")!==null){
                    JSON.parse(localStorage.getItem("arraySales")).map((sales)=>{
                        if(('PC-'+p.pedido_nota_consumo_maestro_id+'-'+p.producto_id+'-'+p.unidad_medida_id+'-'+consumptionSelect.reserva_estancia_id)===sales.id){
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
    },[props.detail_order]);

    //se filtra los registros cliente segun el valor de search
    function filter (rows){
        return rows.filter(
            (row)=>row.cliente.toLowerCase().indexOf(search.toLowerCase())>-1
        );
    }

    //actualiza los registros de values
    const handleInputChange=(e)=>{
        if(e.target.type ==='checkbox'){
            var {name, checked}= e.target;
            checked= (checked===true)? 1:0;
            setValues({...values,[name]:checked});
        }
        if(e.target.type==='text'){
            const {name, value}= e.target;
            setValues({...values,[name]:value});
        }
        if(e.target.type==='select-one'){
            const {name, value}= e.target;
            setValues({...values,[name]: parseInt(value)});
        }
        if(e.target.type==='number'){
            const {name, value}= e.target;
            setValues({...values,[name]: parseInt(value)});
        }
        if(e.target.type==='date'){
            const {name, value}= e.target;
            setValues({...values,[name]:value});
        }
    }

    //seleciona un produc de datalle de la orden
    const detailsSelectAll=()=>{
        setPaySelectAll(!paySelectAll);
        if(!paySelectAll){
            setRowsDetail(rowsDetail.map(p=>{
            if(p.estado_facturacion===0){
                if(p.select===false){
                    p.select=true;
                }
            }
                return p;
            }));
            const tConsumoSelect=[];
            rowsDetail.map((row)=>{
                console.log(row);
                if(row.estado_facturacion===0){
                    console.log(row);
                    if(row.select===true || row.select===false){
                        const tRow={
                            id:'PC-'+row.pedido_nota_consumo_maestro_id+'-'+row.producto_id+'-'+row.unidad_medida_id+'-'+consumptionSelect.reserva_estancia_id,
                            codigo_producto:row.producto_id,
                            unidad_medida_id:row.abreviatura,
                            precio_venta: parseFloat(row.precio_unitario),
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
            setRowsDetail(props.detail_order.detalle.map(p=>{
                /* p.id = p.producto_id; */
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

    // se pasan los detalles selecionados al componente padre para ser facturado
    const addConsumptionRecord=()=>{
        if((rowsDetailSelect.length)>0){
            console.log(rowsDetailSelect);
            props.addProductReservation(rowsDetailSelect);
            dataReset();
            hideModal();
            props.consumptionSelect();
        }else{
            toast.error("Aun no se seleccionó ningun item");
        }
    }

    //se reinician los valores
    const dataReset=()=>{
        setRowsDetailSelect([]);
        setPaySelectAll(false);
        setRowsDetail([]);
        setRows([]);
        setConsumptionSelect(null);
    }
    return (
        <div>
            <Modal size="xl" show={props.statusModal} onHide={hideModal} centered>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title className="ml-3">Pedido / Consumo</Modal.Title>
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
                                <div style={{ height:300, width:"100%"}} className="mt-2">
                                    <DataGrid onRowClick={({row})=>{console.log(row);}} rows={rowsDetail} columns={columnsDetails} hideFooterSelectedRowCount={true} rowHeight={45} disableColumnMenu={true}/>
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
        list_orders: state.app.orders.list_orders,
        detail_order: state.app.orders.detail_order
    };
};
const mapDispatchToProps = dispatch => {
    return {
        getListOrders:()=>dispatch(Actions.getListOrders()),
        getDetailOrders: (idOrder)=>dispatch(Actions.getDetailOrders(idOrder)),
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withDragDropContext(ConsumptionModal));