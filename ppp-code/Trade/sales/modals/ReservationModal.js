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
const ReservationModal= (props)=>{
    const dispatch = useDispatch();
    const [search, setSearch]= useState("");
    const[rows, setRows]= useState([]);
    const [rowsConsumSelect, setRowsConsumSelect]= useState([]);
    const [conSelectAll,setConSelectAll]=useState(false);
    const [rowsPaySelect, setRowsPaySelect]= useState([]);
    const [paySelectAll,setPaySelectAll]=useState(false);
    const[rowsConsum, setRowsConsum]= useState([]);
    const[rowsPay, setRowsPay]= useState([]);
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
    const[consumptionSelect, setConsumptionSelect]= useState(null);

    //consulta los registros de reserva
    useEffect(()=>{
        if(props.statusModal){
            props.getAllReservationResidence();
        }
    },[props.statusModal]);

    //pasan los registros de reserva al datagrid
    useEffect(()=>{
        if(localStorage.getItem("arraySales")===null ){
            
            setRows(props.reservation_residence.map(p => {
                p.id = p.reserva_estancia_id;
                return p;
            }));
        }else{
            //rows.filter(p=>p.reserva_estancia_id=== parseInt(tAddSales[0].id.split('-')[1]))
            setRows(props.reservation_residence.filter(p=>p.reserva_estancia_id=== parseInt(JSON.parse(localStorage.getItem("arraySales"))[0].id.split('-')[1])).map(p => {
                p.id = p.reserva_estancia_id;
                return p;
            }));
            setConsumptionSelect(props.reservation_residence.filter(p=>p.reserva_estancia_id=== parseInt(JSON.parse(localStorage.getItem("arraySales"))[0].id.split('-')[1])).map(p => {
                p.id = p.reserva_estancia_id;
                return p;
            })[0]);
            props.getAllReservationResidenceConsumptionStay(parseInt(JSON.parse(localStorage.getItem("arraySales"))[0].id.split('-')[1]));
        }
        
    },[props.reservation_residence]);

    //se inicializan los registrosde datagrid
    useEffect(()=>{
        if(props.reservation_residence_consumption_stay!==undefined && Object.keys(props.reservation_residence_consumption_stay).length!==0){
            setRowsConsum(props.reservation_residence_consumption_stay.consumo.map(p=>{
                let i=0;
                p.id= p.pedido_nota_consumo_maestro_id;
                if(localStorage.getItem("arraySales")!==null){
                    JSON.parse(localStorage.getItem("arraySales")).map((sales)=>{
                        if(('RC-'+p.reserva_estancia_id+'-'+p.producto_id+'-'+p.unidad_medida_id)===sales.id){
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
            setRowsPay(props.reservation_residence_consumption_stay.pagos.map(p=>{
                let j=0;
                p.id= p.pago_id;
                if(localStorage.getItem("arraySales")!==null){
                    JSON.parse(localStorage.getItem("arraySales")).map(sales=>{
                        console.log('RC-'+p.reserva_estancia_id+'-'+p.id+'-ZZ'+"="+ sales.id)
                        if(('RC-'+p.reserva_estancia_id+'-'+p.id+'-ZZ')===sales.id){
                            j++;
                        }
                    });
                }
                if(j===0){
                    p.select=false;
                }else{
                    p.select=null;
                }
                
                
                return p;
            }));
        }
        
    },[props.reservation_residence_consumption_stay]);

    
    //se consumen los rregistros de consumo de reserva y se asigna a datagrid
    const detailsSelectAll=()=>{
        setConSelectAll(!conSelectAll);
        if(!conSelectAll){
            setRowsConsum(rowsConsum.map(p=>{
                //p.id= p.pedido_nota_consumo_maestro_id;
                if(p.estado_facturacion===0){
                    if(p.select===false){
                        p.select=true;
                    }
                }
                
                return p;
            }));
            const tConsumoSelect=[];
            rowsConsum.map((row)=>{
                if(row.estado_facturacion===0){
                    if(row.select===true || row.select===false){
                        const tRow={
                            id:'RC-'+row.reserva_estancia_id+'-'+row.producto_id+'-'+row.unidad_medida_id,
                            codigo_producto:row.producto_id,
                            unidad_medida_id:row.abreviatura,
                            precio_venta: row.precio_unitario,
                            denominacion:row.denominacion,
                            cantidad: parseInt(row.cantidad),
                            importe: parseFloat(row.sub_total),
                            descuento:0,
                            persona_id:consumptionSelect.persona_id,
                            pedido_nota_consumo_maestro_id:row.pedido_nota_consumo_maestro_id
                        }
                        tConsumoSelect.push(tRow);
                    }
                }

            });
            setRowsConsumSelect(tConsumoSelect);
        }else{
            setRowsConsum(rowsConsum.map(p=>{
                //p.id= p.pedido_nota_consumo_maestro_id;
                if(p.estado_facturacion===0){
                    if(p.select===true){
                        p.select=false;
                    }
                }
                return p;
            }));
            setRowsConsumSelect([]);
        }
        
    }

    //Selecciona todos los detalles de reserva de datagrid
    const vouchersSelectAll=()=>{
        setPaySelectAll(!paySelectAll);
        if(!paySelectAll){
            setRowsPay(rowsPay.map(p=>{
                //p.id= p.pago_id;
                if(p.estado_facturacion===0){
                    if(p.select===false){
                        p.select=true;
                    }
                }
                return p;
            }));
            const tConsumoSelect=[];
            rowsPay.map((row)=>{
                if(row.estado_facturacion===0){
                    if(row.select===true || row.select===false){
                        const tRow={
                            id:'RC-'+row.reserva_estancia_id+'-'+row.pago_id+'-ZZ',
                            codigo_producto:row.pago_id,
                            unidad_medida_id:'ZZ',
                            precio_venta: row.monto_deposito,
                            denominacion:row.concepto,
                            cantidad:1,
                            importe: parseFloat(row.monto_deposito),
                            descuento:0,
                            persona_id:consumptionSelect.persona_id
                        }
                        tConsumoSelect.push(tRow);
                    }
                }
            });
            setRowsPaySelect(tConsumoSelect);
        }else{
            setRowsPay(props.reservation_residence_consumption_stay.pagos.map(p=>{
                //p.id= p.pago_id;
                if(p.estado_facturacion===0){
                    if(p.select===true){
                        p.select=false;

                    }
                }
                return p;
            }));
            setRowsPaySelect([]);
        }
    }
    //se inicializan las columnas de datagrid
    const columns=[
        {
            field: '',
            headerName:'Acciones',
            headerAlign:'center',
            width:140,
            disableClickEventBuddling: true,            
            renderCell: (params)=>{
                //datalle de consumo de reserva 
                const onClickDetail=()=>{
                    const thisRow=params.row;
                    setConsumptionSelect(thisRow);
                    props.getAllReservationResidenceConsumptionStay(thisRow.reserva_estancia_id);
                }
                if(params.row.detalleCant>0){
                    return  <>
                        {/* <Button  variant="success">Agregar</Button> */}
                        <Button onClick={onClickDetail} className="ml-3" variant="primary">Ver detalle</Button>
                    </>;
                }else{
                    return  <>
                            {/* <Button  variant="success">Agregar</Button> */}
                            <Button onClick={onClickDetail} className="ml-3" variant="secondary" data-toggle="tooltip" data-placement="right" title="Los items de reserva ya fueron facturados">Facturado</Button>
                        </>;
                }
                
                
            }
        },
        {field: 'id', hide:true, identify: true},
        {field: 'fecha_checkout', headerName:'Fecha Check out', headerAlign:'center', type:'number', width:190},
        {field: 'razon_social_nombre', headerName:'Cliente', headerAlign:'center', flex:1},
        {field: 'numero_habitacion', headerName:'Habitación', headerAlign:'center',  width:150},
        {field: 'precio', headerName:'Importe', headerAlign:'center', type:'number', width:150},
    ];
    //inicializa las columnas de detalle de consumo
    const columnsDetails=[
        {
            field: '',
            headerName:'Acciones',
            headerAlign:'center',
            width:110,
            disableClickEventBuddling: true,            
            renderCell: (params)=>{
                /* //captura el id de producto y se muestra el modal
                const onClickEdit =()=>{
                    const thisRow=params.row;
                    //console.log(thisRow);
                    setRoomSelected(thisRow);
                    showRoomModal();
                } */
                //Agregar detalle al array para luego ser listado en data grid y ser facturado
                const onClickCheck=()=>{
                    const thisRow=params.row;
                    /* deleteproductRow(thisRow); */
                    /*  
                    codigo_producto
                    descripcion
                    cantidad
                    importe
                    descuento */
                    if(thisRow.select!=null){
                        thisRow.select=!thisRow.select;
                    }
                    if(thisRow.select){
                        const tValues={
                            id:'RC-'+thisRow.reserva_estancia_id+'-'+thisRow.producto_id+'-'+thisRow.unidad_medida_id,
                            codigo_producto:thisRow.producto_id,
                            unidad_medida_id:thisRow.abreviatura,
                            precio_venta: thisRow.precio_unitario,
                            denominacion:thisRow.denominacion,
                            cantidad: parseInt(thisRow.cantidad),
                            importe: parseFloat(thisRow.sub_total),
                            descuento:0,
                            persona_id:consumptionSelect.persona_id,
                            pedido_nota_consumo_maestro_id:thisRow.pedido_nota_consumo_maestro_id
                        }
                        //props.addProductReservation(tValues);
                        setRowsConsumSelect([...rowsConsumSelect, tValues]);
                    }else{
                        //console.log([...rowsConsumSelect, rowsConsumSelect.filter((rowConsum)=>{return rowConsum.id!=='RC-'+thisRow.producto_id})]);
                        setRowsConsumSelect(rowsConsumSelect.filter((rowConsum)=>{return rowConsum.id!=='RC-'+thisRow.producto_id}));
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
        {
            field: 'abreviatura', 
            headerName:'UM', 
            headerAlign:'center', 
            width:120
        },
        {field: 'denominacion', headerName:'Descripción', headerAlign:'center', flex:1},
        {field: 'precio_unitario', headerName:'Precio', headerAlign:'center', type:'number', width:80},
        {field: 'sub_total', headerName:'Importe', headerAlign:'center', type:'number', width:150},
    ];
   //inicializa las columnas de detalle de pagos
    const columnsVouchers=[
        {
            field: '',
            headerName:'Acciones',
            headerAlign:'center',
            width:110,
            disableClickEventBuddling: true,            
            renderCell: (params)=>{
               
                //Agregar detalle al array para luego ser listado en data grid y ser facturado
                const onClickCheck=()=>{
                    const thisRow=params.row;
                    if(thisRow.select!==null){
                        thisRow.select=!thisRow.select;
                    }
                    if(thisRow.select){
                        const tValues={
                            id:'RC-'+thisRow.reserva_estancia_id+'-'+thisRow.pago_id+'-ZZ',
                            codigo_producto:thisRow.pago_id,
                            unidad_medida_id:'ZZ',
                            precio_venta: thisRow.monto_deposito,
                            denominacion:thisRow.concepto,
                            cantidad:1,
                            importe: parseFloat(thisRow.monto_deposito),
                            descuento:0,
                            persona_id:consumptionSelect.persona_id
                        }
                        setRowsPaySelect([...rowsPaySelect, tValues]);
                        //props.addProductReservation(tValues);
                    }else{
                        
                        /* console.log([...rowsPaySelect, rowsPaySelect.map((rowPay)=>rowPay.id!='RP-'+thisRow.pago_id)]); */
                        setRowsPaySelect(rowsPaySelect.filter((rowPay)=>{return rowPay.id!=='RC-'+thisRow.pago_id}));
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
        {field: 'fecha_hora_deposito', headerName:'Fecha de emision', headerAlign:'center', width:190},
        {field: 'razon_social_nombre', headerName:'Cliente', headerAlign:'center', flex:1},
        {field: 'concepto', headerName:'Concepto', headerAlign:'center', width:190},
        {field: 'iddocumento', headerName:'Comprobante', headerAlign:'center', type:'number', width:150},
        {field: 'monto_deposito', headerName:'Importe', headerAlign:'center', type:'number', width:150}
    ];

    //
    function handleSubmit(e){
        e.preventDefault();
        
        //console.log(factura);
        setValues(initialsStateValues);
        setRows([]);
        props.hideModal();
    }

    //resetea y oculta modal
    const hideModal=()=>{
        dataReset();
        setValues(initialsStateValues);
        props.hideModal();
        
    };

    //se filtra los registros dede datagrid segun el valor de search
    function filter (rows){
        return rows.filter(
            (row)=>row.razon_social_nombre.toLowerCase().indexOf(search.toLowerCase())>-1
        );
    }
    
    //Valida los registros y los pasa al componente padre
    const addsalesRecord=()=>{
        if((rowsConsumSelect.length+rowsPaySelect.length)>0){
            let tAddSales=[];
            rowsConsumSelect.map((rowCon)=>{
                tAddSales.push(rowCon);
                
            })
            rowsPaySelect.map((rowPay)=>{
                tAddSales.push(rowPay);
            })
        /* console.log(tAddSales) */
            props.addProductReservation(tAddSales);
        /* dataReset();1 */
            /* console.log(rows.filter(p=>p.reserva_estancia_id=== parseInt(tAddSales[0].id.split('-')[1])))
            setRows(rows.filter(p=>p.reserva_estancia_id=== parseInt(tAddSales[0].id.split('-')[1]) )); */
            hideModal();
            props.reservationSelect();
        }else{
            toast.error("Aun no se seleccionó ningun item");
        }
        
        //props.addProductReservation(tValues);
    };

    //Reser data values
    const dataReset=()=>{
        setRowsConsumSelect([]);
        setRowsPaySelect([]);
        setPaySelectAll(false);
        setConSelectAll(false);
        setRowsConsum([]);
        setRowsPay([]);
        setRows([]);
        setConsumptionSelect(null);
    }
    return (
        <div>
            <Modal size="xl" show={props.statusModal} onHide={hideModal} centered>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title className="ml-3">Reservas</Modal.Title>
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
                                <div style={{ height: 200, width:"100%"}} className="mt-2">
                                    <DataGrid onRowClick={({row})=>{console.log(row);}} rows={filter(rows)} columns={columns} pageSize={2} hideFooterSelectedRowCount={true} rowHeight={45} disableColumnMenu={true}/>
                                </div>
                            </Row>
                            <Row className="mt-3">
                                
                                <Col><strong>Consumo de la habitación</strong></Col>
                                {(rowsConsum.length>0)? <Col className="d-flex justify-content-end"><Button onClick={detailsSelectAll} className="mr-3" variant="success">{(conSelectAll)? <i className="fas fa-check-square"/>:<i className="far fa-check-square"/>}</Button></Col>:<></>}
                                

                            </Row>
                            <Row>
                                <div style={{ height: 300, width:"100%"}} className="mt-2">
                                    <DataGrid onRowClick={({row})=>{console.log(row);}} rows={rowsConsum} columns={columnsDetails} hideFooterSelectedRowCount={true} rowHeight={45} disableColumnMenu={true}/>
                                </div>
                            </Row>
                            <Row className="d-flex justify-content-between mt-3">
                                <Col><strong>Pagos registrados</strong></Col>
                                {(rowsPay.length>0)? <Col className="d-flex justify-content-end"><Button  onClick={vouchersSelectAll} variant="success" className="mr-3">{(paySelectAll)? <i className="fas fa-check-square"/>:<i className="far fa-check-square"/>}</Button></Col>:<></>}
                                
                            </Row>
                            <Row>
                                <div style={{ height: 300, width:"100%"}} className="mt-2">
                                    <DataGrid onRowClick={({row})=>{console.log(row);}} rows={rowsPay} columns={columnsVouchers} hideFooterSelectedRowCount={true} rowHeight={45} disableColumnMenu={true}/>
                                </div>
                            </Row>
                            <Row className="mt-3">
                                <Col className="d-flex justify-content-end">
                                    <Button  variant="success" onClick={addsalesRecord}/* className="mr-3" */>Agregar</Button>
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
        userRole: state.auth.user[0],
        reservation_residence: state.app.sales.reservation_residence,
        reservation_residence_consumption_stay: state.app.sales.reservation_residence_consumption_stay
    };
};
const mapDispatchToProps = dispatch => {
    return {
        getAllReservationResidence: ()=>dispatch(Actions.getAllReservationResidence()),
        getAllReservationResidenceConsumptionStay:(idReservation)=>dispatch(Actions.getAllReservationResidenceConsumptionStay(idReservation))
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withDragDropContext(ReservationModal));