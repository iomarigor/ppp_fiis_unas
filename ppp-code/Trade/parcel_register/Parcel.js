import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { connect } from "react-redux";
import Content from "components/templates/content";
import withDragDropContext from "./helper/withDnDContext";
import ParcelRegister from "./tabs/ParcelRegister";
import ParcelArrivals from "./tabs/ParcelArrivals";
const Parcel = (props) => {
  const [key, setKey] = useState("ParcelRegister");

  return (
    <React.Fragment>
      <Content
        title="Procesos"
        section="Encomiendas"
        content={
          <div className="row">
            <div className="col-12">
              <div className="card">
                <Tabs activeKey={key} onSelect={(k) => setKey(k)}>
                  <Tab
                    eventKey="ParcelRegister"
                    title="Registro de encomiendas"
                  >
                    {key === "ParcelRegister" ? (
                      <ParcelRegister tabKey="ParcelRegister" />
                    ) : (
                      <></>
                    )}
                  </Tab>
                  <Tab eventKey="ParcelArrivals" title="Encomiendas por llegar">
                    {key === "ParcelArrivals" ? (
                      <ParcelArrivals tabKey="ParcelArrivals" />
                    ) : (
                      <></>
                    )}
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        }
      />
    </React.Fragment>
  );
};
export default Parcel;
