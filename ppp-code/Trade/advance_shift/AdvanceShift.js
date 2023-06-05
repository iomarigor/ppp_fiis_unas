import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, Col, Row } from "react-bootstrap";
import Content from "components/templates/content";
import { connect } from "react-redux";
import { DataGrid, esES } from "@material-ui/data-grid";
import * as Actions from "store/actions/app";
import withDragDropContext from "./helper/withDnDContext";
import Loader from "../helpers/loader/Loader";
import AdvanceShiftModal from "./modals/AdvanceShiftModal";

const AdvanceShift = (props) => {
  const [managementDriverModal, setManagementDriverModal] = useState(false);
  const [managementDriverSelect, setManagementDriverSelect] = useState(null);
  const [rows, setRows] = useState(null);
  useEffect(() => {
    props.getManagementDriver();
  }, []);
  useEffect(() => {
    props.getAdvanceShift();
  }, [props.crud_advance_shift]);
  useEffect(() => {
    if (props.list_advance_shift) {
      setRows(
        props.list_advance_shift
          .filter((p) => p.idusers == props.userRole.id)
          .map((p) => {
            p.id = p.idadelantoturno;
            return p;
          })
      );
    }
  }, [props.list_advance_shift]);
  const columns = [
    {
      field: "",
      headerName: "Acciones",
      headerAlign: "center",
      align: "center",
      width: 150,
      disableClickEventBuddling: true,
      renderCell: ({ row }) => {
        //Editar Order y abrir modal
        const onClickEdit = () => {
          setManagementDriverModal(true);
          setManagementDriverSelect(row);
        };

        //imprimir orden
        const onClickPrint = () => {
          window.open(
            `${process.env.REACT_APP_API_URL}/api/adelantoturno/${row.idadelantoturno}`,
            "_blank"
          );
        };

        //Eliminar orden
        const onClickDelete = () => {
          props.deleteAdvanceShift(row);
        };
        return (
          <>
            <Button onClick={onClickEdit} className="mr-xl-1" variant="primary">
              <i
                className="fas fa-edit"
                data-toggle="tooltip"
                data-placement="right"
                title="Actulizar"
              ></i>
            </Button>
            <Button
              onClick={onClickPrint}
              className="mr-xl-1"
              variant="primary"
            >
              <i
                className="fas fa-print"
                data-toggle="tooltip"
                data-placement="right"
                title="Imprimir"
              ></i>
            </Button>
            <Button
              onClick={onClickDelete}
              className="mr-xl-1"
              variant="danger"
            >
              <i
                className="fas fa-trash"
                data-toggle="tooltip"
                data-placement="right"
                title="Eliminar"
              ></i>
            </Button>
          </>
        );
      },
    },
    { field: "id", headerName: "ID", hide: true, identify: true },
    {
      field: "razonsocial",
      headerName: "Chofer",
      headerAlign: "center",
      flex: 1,
    },
    { field: "placa", headerName: "Vehiculo", headerAlign: "center", flex: 1 },
    { field: "motivo", headerName: "Motivo", headerAlign: "center", flex: 1 },
    {
      field: "fecha",
      headerName: "Fecha",
      headerAlign: "center",
      flex: 1,
      type: "dateTime",
    },
  ];
  return (
    <React.Fragment>
      <Content
        title="Gestion de adelanto de turno"
        section="Mantenedor de adelanto de turno"
        content={
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <i className="fas fa-bed mr-1"></i>Adelanto de turno
                  </h3>
                </div>
                <div className="card-body">
                  <div className="row d-flex justify-content-between">
                    <div className="col-1">
                      <button
                        onClick={() => {
                          setManagementDriverSelect(null);
                          setManagementDriverModal(true);
                        }}
                        className="btn btn-primary"
                      >
                        Registrar
                      </button>
                    </div>
                    <div className="col-1 mr-3">
                      <button
                        onClick={() => {
                          console.log("imprimir reporte");
                        }}
                        className="btn btn-primary"
                      >
                        Reporte
                      </button>
                    </div>
                  </div>
                  <div
                    style={{ height: 420, width: "100%" }}
                    className="mt-2  position-relative"
                  >
                    <Loader show={!props.list_advance_shift} center={true} />
                    <div style={{ width: "100%", height: "100%" }}>
                      {props.list_advance_shift ? (
                        <DataGrid
                          rows={rows ? rows : []}
                          columns={columns}
                          localeText={esES.props.MuiDataGrid.localeText}
                          hideFooter={true}
                          hideFooterSelectedRowCount={true}
                          rowHeight={45}
                          disableColumnMenu={true}
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      />
      <AdvanceShiftModal
        statusModal={managementDriverModal}
        hideModal={() => {
          setManagementDriverModal(false);
          setManagementDriverSelect(null);
        }}
        driverSelect={managementDriverSelect}
      />
    </React.Fragment>
  );
};
const mapStateToProps = (state) => {
  return {
    list_advance_shift: state.app.advanceShift.list_advance_shift,
    crud_advance_shift: state.app.advanceShift.crud_advance_shift,
    userRole: state.auth.user[0],
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getAdvanceShift: () => dispatch(Actions.getAdvanceShift()),
    deleteAdvanceShift: (form) => dispatch(Actions.deleteAdvanceShift(form)),
    getManagementDriver: () => dispatch(Actions.getManagementDriver()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDragDropContext(AdvanceShift));
