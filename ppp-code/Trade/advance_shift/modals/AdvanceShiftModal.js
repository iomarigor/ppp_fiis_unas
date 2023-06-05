import React,{useState, useEffect} from 'react';
import {Modal, Button, Container, Row, Col, Form,InputGroup,Badge} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { connect } from "react-redux";
import withDragDropContext from "../helper/withDnDContext";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import Select from 'react-select';
import * as Actions from "store/actions/app";
const AdvanceShiftModal= (props)=>{    
    const initialsStateValues={
        idadelantoturno:null,
        idtransportista: null,
        motivo:null,
        idusers:props.userId
    }
    const [values, setValues] = useState(initialsStateValues);
    useEffect(()=>{
        if(props.statusModal){
            if(props.driverSelect){
                
                setValues(props.driverSelect);
            }else{
                setValues(initialsStateValues);
            }
            
        }
    },[props.statusModal]);
    function validateForm(){
        
        if((!values.idtransportista)|| values.idtransportista==""){
            toast.error("Seleccione el transportista");
            focusForm("idtransportista");
            return true;
        }
        
        if((!values.motivo)|| values.motivo==""){
            toast.error("Ingrese el motivo");
            focusForm("motivo");
            return true;
        }
        return false;
    }
    function handleSubmit(e){
        e.preventDefault();
        if(validateForm())return;
        if(props.driverSelect){
            props.updateAdvanceShift(values);
        }else{
            props.saveAdvanceShift(values);
        }
        setValues(initialsStateValues);
        props.hideModal();
    }
    const handleInputChange=(e)=>{
        //console.log(e.target.type);
        if(e.target.type ==='checkbox'){
            var {name, checked}= e.target;
            checked= (checked===true)? 1:0;
            setValues({...values,[name]:checked});
        }
        if(e.target.type==='text'){
            //console.log(e.target.type);
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
    const focusForm=(idForm)=>{
        const x = document.getElementById(idForm);
        x.focus();
    }
    return (
        <div>
            <Modal size="md" show={props.statusModal} onHide={props.hideModal} centered >
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{(!props.driverSelect)? 'Registrar conductor':'Actualizar conductor'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                        <Container>
                            <Row>
                                <Col>
                                    <label className="form-label" >Transportista:</label>
                                    <select className="form-select" value={values.idtransportista||0} name="idtransportista" id="idtransportista" onChange={handleInputChange}>
                                        <option value={0} disabled>Seleccionar</option>
                                        {
                                            (props.list_drivers)?
                                            props.list_drivers.map(driver=>{ 
                                                return(
                                                    <option value={driver.idtransportista} key={driver.idtransportista}> {driver.razonsocial} </option>
                                                );
                                            })
                                            :
                                            <></>
                                        }                                                        
                                    </select>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <label className="form-label" >Motivo:</label>
                                    <input className="form-control" value={ values.motivo||""} name="motivo" id="motivo" onChange={handleInputChange} type="text"/>
                                </Col>
                            </Row>
                            
                            <Row className="mt-3">
                                <Col>
                                    <Button variant="primary" type="submit">{(!props.driverSelect)? 'Guardar':'Actualizar'} </Button>
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
        //users: state.app.users.users,
        userId: state.auth.user[0].id,
        list_drivers: state.app.managementDriver.list_drivers,
    };
};
const mapDispatchToProps = dispatch => {
    return {
        saveAdvanceShift:(form)=>dispatch(Actions.saveAdvanceShift(form)),
        updateAdvanceShift:(form)=>dispatch(Actions.updateAdvanceShift(form))

    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withDragDropContext(AdvanceShiftModal));