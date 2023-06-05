import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, Col, Row } from "react-bootstrap";
import Content from "components/templates/content";
import { connect } from "react-redux";
import { DataGrid, esES } from "@material-ui/data-grid";
import * as Actions from "store/actions/app";
import withDragDropContext from "../helper/withDnDContext";
import Loader from "../../helpers/loader/Loader";
import ParcelRegisterModal from "../modals/ParcelRegisterModal";
import ParcelPickUp from "../modals/ParcelPickUp";
import InvoiceRegisterModal from "../modals/InvoiceRegisterModal";
const ParcelArrivals = (props) => {
  const [managementDriverModal, setManagementDriverModal] = useState(false);
  const [managementDriverSelect, setManagementDriverSelect] = useState(null);
  const [parcelPickUpModal, setParcelPickUpModal] = useState(false);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [invoiceRegisterModal, setInvoiceRegisterModal] = useState(false);
  useEffect(() => {
    console.log("user_ID", props.userRole.id);
    props.getManagementDriver();
    props.getAllSeries(props.userRole.id);
    props.getAllUnitMeasures();
    props.getAllOpenings();
    props.getDataBranchs();
    props.getAllVouchers();
    props.getPriceDollar();
    props.getAllCoinType();
  }, []);
  useEffect(() => {
    console.log("user_ID", props.userRole.id);
    props.getParcelRegister();
    props.getAllSeries(props.userRole.id);
    props.getAllUnitMeasures();
  }, [props.crud_parcel_register]);
  useEffect(() => {
    if (props.list_parcel_register) {
      setRows(
        props.list_parcel_register
          .filter(
            (p) =>
              p.idusuario != props.userRole.id &&
              p.id_sucursal_inicio != props.userRole.sucursal_id
          )
          .map((p) => {
            p.id = p.id_encomienda;
            if (p.estado == 0) p.estadoText = "ORIGEN";
            if (p.estado == 1) p.estadoText = "TRANSITO";
            if (p.estado == 2) p.estadoText = "DESTINO";
            if (p.estado == 3) p.estadoText = "ENTREGADO";
            return p;
          })
      );
    }
  }, [props.list_parcel_register]);
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
          if (props.openings) {
            if (
              props.openings.filter(
                (opening) =>
                  opening.id_usuario === props.userRole.id &&
                  opening.estado === 0
              ).length === 0
            ) {
              toast.error("Caja no aperturada");
            } else {
              setManagementDriverModal(true);
              setManagementDriverSelect(row);
              props.getParcelRegisterDetail(row);
            }
          } else {
            toast.warning("Obteniendo info...");
          }
        };

        //imprimir orden
        const onClickPrint = () => {
          window.open(
            `${process.env.REACT_APP_API_URL}/api/encomienda/${row.id_encomienda}`,
            "_blank"
          );
        };

        //Eliminar orden
        const onClickDelete = () => {
          props.deleteParcelRegister(row);
        };
        const onClickFacturacion = () => {
          if (props.openings) {
            if (
              props.openings.filter(
                (opening) =>
                  opening.id_usuario === props.userRole.id &&
                  opening.estado === 0
              ).length === 0
            ) {
              toast.error("Caja no aperturada");
            } else {
              props.getAllUnitMeasuresByProduct(2);
              setInvoiceRegisterModal(true);
              setManagementDriverSelect(row);
              props.getParcelRegisterDetail(row);
            }
          } else {
            toast.warning("Obteniendo info...");
          }
        };
        if (row.idusuario == props.userRole.id) {
          if (row.estado == 0) {
            return (
              <>
                {row.estado_facturacion == 0 && row.condicion == "PAGADO" ? (
                  <Button
                    onClick={onClickFacturacion}
                    className="mr-xl-1"
                    variant="primary"
                  >
                    <i
                      className="fas fa-clipboard-list"
                      data-toggle="tooltip"
                      data-placement="right"
                      title="Facturar"
                    ></i>
                  </Button>
                ) : (
                  <></>
                )}
                <Button
                  onClick={onClickEdit}
                  className="mr-xl-1"
                  variant="primary"
                >
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
          } else if (row.estado == 1 || row.estado == 2) {
            return (
              <>
                {row.estado_facturacion == 0 && row.condicion == "PAGADO" ? (
                  <Button
                    onClick={onClickFacturacion}
                    className="mr-xl-1"
                    variant="primary"
                  >
                    <i
                      className="fas fa-clipboard-list"
                      data-toggle="tooltip"
                      data-placement="right"
                      title="Facturar"
                    ></i>
                  </Button>
                ) : (
                  <></>
                )}
                <Button
                  onClick={onClickEdit}
                  className="mr-xl-1"
                  variant="primary"
                >
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
              </>
            );
          } else {
            return (
              <>
                {row.estado_facturacion == 0 && row.condicion == "PAGADO" ? (
                  <Button
                    onClick={onClickFacturacion}
                    className="mr-xl-1"
                    variant="primary"
                  >
                    <i
                      className="fas fa-clipboard-list"
                      data-toggle="tooltip"
                      data-placement="right"
                      title="Facturar"
                    ></i>
                  </Button>
                ) : (
                  <></>
                )}
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
              </>
            );
          }
        } else {
          return (
            <>
              {row.estado_facturacion == 0 &&
              row.condicion != "PAGADO" &&
              row.estado == 3 ? (
                <Button
                  onClick={onClickFacturacion}
                  className="mr-xl-1"
                  variant="primary"
                >
                  <i
                    className="fas fa-clipboard-list"
                    data-toggle="tooltip"
                    data-placement="right"
                    title="Facturar"
                  ></i>
                </Button>
              ) : (
                <></>
              )}
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
            </>
          );
        }
      },
    },
    { field: "id", headerName: "ID", hide: true, identify: true },
    {
      field: "serie_comprobante",
      headerName: "Comprobante",
      headerAlign: "center",
      align: "center",
      width: 120,
      disableClickEventBuddling: true,
      renderCell: ({ row }) => {
        return (
          <>
            {row.serie_comprobante}-{leftZero(row.correlativo, 7)}
          </>
        );
      },
    },
    {
      field: "remitente_nombre",
      headerName: "Remitente",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "remitente_documento",
      headerName: "DNI/RUC",
      headerAlign: "center",
      width: 140,
      align: "center",
    },
    {
      field: "username",
      headerName: "Reg. por",
      headerAlign: "center",
      width: 150,
      align: "center",
    },
    {
      field: "sucursalinicio",
      headerName: "Transito",
      headerAlign: "center",
      align: "center",
      width: 120,
      disableClickEventBuddling: true,
      renderCell: ({ row }) => {
        return (
          <>
            {row.sucursalinicio} - {row.sucursalfin}
          </>
        );
      },
    },
    {
      field: "fecharegistro",
      headerName: "Fecha",
      headerAlign: "center",
      width: 170,
      align: "center",
      type: "dateTime",
    },
    {
      field: "estado",
      headerName: "Estado",
      headerAlign: "center",
      align: "center",
      width: 150,
      disableClickEventBuddling: true,
      renderCell: ({ row }) => {
        //Editar Order y abrir modal
        const updateStatus = (status) => {
          //console.log({ ...row, estado: status, id_user: props.userRole.id });
          if (status == 3) {
            if (props.openings) {
              if (
                props.openings.filter(
                  (opening) =>
                    opening.id_usuario == props.userRole.id &&
                    opening.estado == 0
                ).length === 0
              ) {
                toast.error("Caja no aperturada");
              } else {
                setParcelPickUpModal(true);
                setManagementDriverSelect(row);
              }
            } else {
              toast.warning("Obteniendo info...");
            }
          } else {
            props.updateStatusParcelRegister({
              ...row,
              estado: status,
              id_user: props.userRole.id,
            });
          }
        };
        if (row.estado == 0)
          if (row.idusuario == props.userRole.id) {
            return (
              <Button variant="warning" onClick={() => updateStatus(1)}>
                Origen
              </Button>
            );
          } else {
            return (
              <Button variant="warning" disabled={true}>
                Origen
              </Button>
            );
          }
        if (row.estado == 1)
          if (row.idusuario != props.userRole.id) {
            return (
              <Button variant="info" onClick={() => updateStatus(2)}>
                Transito
              </Button>
            );
          } else {
            return (
              <Button variant="info" disabled={true}>
                Transito
              </Button>
            );
          }
        if (row.estado == 2)
          if (row.idusuario != props.userRole.id) {
            return (
              <Button variant="secondary" onClick={() => updateStatus(3)}>
                Destino
              </Button>
            );
          } else {
            return (
              <Button variant="secondary" disabled={true}>
                Destino
              </Button>
            );
          }
        if (row.estado == 3)
          return (
            <Button variant="success" disabled={true}>
              Entregado
            </Button>
          );
      },
    },
  ];
  function leftZero(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }
  function filter(rows) {
    return rows.filter(
      (row) =>
        row.remitente_nombre.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
        row.consignado_nombre.toLowerCase().indexOf(search.toLowerCase()) >
          -1 ||
        row.remitente_documento.toLowerCase().indexOf(search.toLowerCase()) >
          -1 ||
        row.consignado_documento.toLowerCase().indexOf(search.toLowerCase()) >
          -1 ||
        row.sucursalinicio.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
        row.sucursalfin.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
        row.estadoText.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
        row.fecharegistro.toLowerCase().indexOf(search.toLowerCase()) > -1
    );
  }
  return (
    <>
      {/* <div className="card-header">
        <h3 className="card-title">
          <i className="fas fa-bed mr-1"></i>Gestion de encomienda
        </h3>
      </div> */}
      <div className="card-body">
        <div className="row">
          <Col sm={6}>
            {/* <button
              onClick={() => {
                if (props.openings) {
                  if (
                    props.openings.filter(
                      (opening) =>
                        opening.id_usuario === props.userRole.id &&
                        opening.estado === 0
                    ).length === 0
                  ) {
                    toast.error("Caja no aperturada");
                  } else {
                    setManagementDriverSelect(null);
                    setManagementDriverModal(true);
                  }
                } else {
                  toast.warning("Obteniendo info...");
                }
              }}
              className="btn btn-primary"
            >
              Registrar
            </button> */}
          </Col>
          <Col
            sm={6}
            className="form-inline my-2 my-lg-0 d-flex justify-content-end"
          >
            <label className="form-label mr-2" htmlFor="search">
              Ingresar criterio de busqueda:
            </label>
            <input
              className="form-control"
              style={{ width: "55%" }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              type="text"
            />
          </Col>
        </div>
        <div
          style={{ height: 420, width: "100%" }}
          className="mt-2  position-relative"
        >
          <Loader show={!props.list_parcel_register} center={true} />
          <div style={{ width: "100%", height: "100%" }}>
            {props.list_parcel_register ? (
              <DataGrid
                rows={filter(rows)}
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

      {managementDriverModal && (
        <ParcelRegisterModal
          statusModal={managementDriverModal}
          hideModal={() => {
            setManagementDriverModal(false);
            setManagementDriverSelect(null);
          }}
          driverSelect={managementDriverSelect}
          leftZero={leftZero}
        />
      )}
      {parcelPickUpModal && (
        <ParcelPickUp
          statusModal={parcelPickUpModal}
          hideModal={() => {
            setParcelPickUpModal(false);
            setManagementDriverSelect(null);
          }}
          driverSelect={managementDriverSelect}
          updateStatus={props.updateStatusParcelRegister}
        />
      )}
      {invoiceRegisterModal && (
        <InvoiceRegisterModal
          statusModal={invoiceRegisterModal}
          hideModal={() => {
            setInvoiceRegisterModal(false);
            setManagementDriverSelect(null);
          }}
          driverSelect={managementDriverSelect}
          leftZero={leftZero}
        />
      )}
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    list_parcel_register: state.app.parcelRegister.list_parcel_register,
    crud_parcel_register: state.app.parcelRegister.crud_parcel_register,
    userRole: state.auth.user[0],
    openings: state.app.manageCash.openings,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getParcelRegister: () => dispatch(Actions.getParcelRegister()),
    deleteParcelRegister: (form) =>
      dispatch(Actions.deleteParcelRegister(form)),
    getParcelRegisterDetail: (form) =>
      dispatch(Actions.getParcelRegisterDetail(form)),
    getManagementDriver: () => dispatch(Actions.getManagementDriver()),
    getAdvanceShift: () => dispatch(Actions.getAdvanceShift()),
    getAllSeries: (from) => dispatch(Actions.getAllSeries(from)),
    getAllVouchers: () => dispatch(Actions.getAllVouchers()),
    getAllOpenings: () => dispatch(Actions.getAllOpenings()),
    getAllUnitMeasures: () => dispatch(Actions.getAllUnitMeasures()),
    getDataBranchs: () => dispatch(Actions.getDataBranchs()),
    updateStatusParcelRegister: (from) =>
      dispatch(Actions.updateStatusParcelRegister(from)),
    getAllTypesPayments: () => dispatch(Actions.getAllTypesPayments()),
    getAllCoinType: () => dispatch(Actions.getAllCoinType()),
    getPriceDollar: () => dispatch(Actions.getPriceDollar()),
    getAllUnitMeasuresByProduct: (form) =>
      dispatch(Actions.getAllUnitMeasuresByProduct(form)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDragDropContext(ParcelArrivals));
