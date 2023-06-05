import React, {useState} from 'react';
import {Tabs,Tab} from 'react-bootstrap';
import { connect } from "react-redux";
import Content from "components/templates/content";
import withDragDropContext from "./helper/withDnDContext";
import SalesRecord from './Tabs/SalesRecord';
import SalesList from './Tabs/SalesList';
const Sales = (props) => {
    const [key, setKey] = useState('salesRecord');
    
    return (<React.Fragment>
        <Content
            title="Procesos"
            section="Ventas"
            content={
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <Tabs
                                activeKey={key}
                                onSelect={(k) => setKey(k)}
                             >
                                <Tab eventKey="salesRecord" title="Registro">
                                    {(key==="salesRecord")? <SalesRecord tabKey="salesRecord"/>:<></>}
                                </Tab>
                                <Tab eventKey="salesList" title="Listado de ventas">
                                    {(key==="salesList")? <SalesList tabKey="salesList"/>:<></>}
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
            } />
    </React.Fragment>)
};
export default Sales;