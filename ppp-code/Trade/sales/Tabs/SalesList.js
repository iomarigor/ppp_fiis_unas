import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Form, Col, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { DataGrid, esES } from "@material-ui/data-grid";
import * as Actions from "store/actions/app";
import withDragDropContext from "../helper/withDnDContext";
import Select from "react-select";
import EditSalesModal from "../modals/EditSalesModal";
import UnitMeasureModal from "../modals/UnitMeasureModal";
import Loader from "../../helpers/loader/Loader";
const SalesList = (props) => {
  const [search, setSearch] = useState("");
  const [editSalesModal, setEditSalesModal] = useState(false);
  const [unitMeasureModal, setUnitMeasureModal] = useState(false);
  const [unitMeasureSelect, setUnitMeasureSelect] = useState(null);
  const [productId, setProductId] = useState(null);
  const [rows, setRows] = useState([]);
  const showUnitMeasureModal = () => {
    setUnitMeasureSelect(null);
    setEditSalesModal(false);
    setUnitMeasureModal(true);
  };
  const hideUnitMeasureModal = () => {
    setEditSalesModal(true);
    setUnitMeasureModal(false);
    setProductId(null);
  };
  const showEditSalesModal = () => {
    setEditSalesModal(true);
  };
  const hideEditSalesModal = () => {
    setEditSalesModal(false);
  };

  //se consulta las ventas
  useEffect(() => {
    if (props.tabKey === "salesList") {
      props.getAllSales(props.userRole.id);
      props.getPriceDollar();
    }
  }, [props.tabKey]);
  const columns = [
    {
      field: "",
      headerName: "Acciones",
      headerAlign: "center",
      width: 110,
      align: "center",
      disableClickEventBuddling: true,
      renderCell: (params) => {
        //Edita la venta y abre el modal
        const onClickEdit = () => {
          const thisRow = params.row;
          /* console.log(thisRow.facturacion_id); */
          if (props.openings) {
            if (
              props.openings.filter(
                (opening) =>
                  parseInt(opening.id_usuario) == parseInt(props.userRole.id) &&
                  parseInt(opening.estado) == 0
              ).length === 0
            ) {
              toast.error("Caja no aperturada");
            } else {
              props.getInfoSales(thisRow.facturacion_id);
              showEditSalesModal();
            }
          } else {
            toast.warning("Obteniendo info...");
          }
        };

        const onClickPrint = () => {
          const thisRow = params.row;
          /* factura/id */
          /* window.open(url, "Diseño Web", "width=300, height=200") */
          window.open(
            `${process.env.REACT_APP_API_URL}/api/factura/1/${thisRow.id}`,
            "_blank"
          );
        };

        return (
          <>
            <Button
              onClick={onClickEdit}
              className="mr-xl-1"
              variant="primary"
              data-toggle="tooltip"
              data-placement="right"
              title="Actualizar"
            >
              <i className="fas fa-edit"></i>
            </Button>
            <Button
              onClick={onClickPrint}
              className="mr-xl-1"
              variant="primary"
              data-toggle="tooltip"
              data-placement="right"
              title="Imprimir"
            >
              <i className="fas fa-print"></i>
            </Button>
          </>
        );
      },
    },
    { field: "id", headerName: "ID", hide: true, identify: true },
    {
      field: "fecha_emision",
      headerName: "Fecha emision",
      headerAlign: "center",
      width: 200,
    },
    {
      field: "razon_social_nombre",
      headerName: "Cliente",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "numero_comprobante",
      headerName: "Comprobante",
      headerAlign: "center",
      flex: 1,
      disableClickEventBuddling: true,
      renderCell: (params) => {
        return (
          <>
            {params.row.serie_comprobante + "-" + params.row.numero_comprobante}
          </>
        );
      },
    },
    {
      field: "totalventas",
      headerName: "Importe",
      headerAlign: "center",
      type: "number",
      width: 120,
    },
    {
      field: "codigo_sunat",
      headerName: "Sunat",
      headerAlign: "center",
      width: 120,
    },
    {
      field: "estado_venta",
      headerName: "Estado",
      disableClickEventBuddling: true,
      width: 95,
      renderCell: (params) => {
        if (!(params.row.estado_venta === -1)) {
          return (
            <Button
              variant="success"
              /* onClick={onClick} */ size="sm"
              data-toggle="tooltip"
              data-placement="right"
              title="Emitido"
              disabled={true}
            >
              Emitido
            </Button>
          );
        } else {
          return (
            <Button
              variant="danger"
              /* onClick={onClick} */ size="sm"
              data-toggle="tooltip"
              data-placement="right"
              title="Anulado"
              disabled={true}
            >
              Anulado
            </Button>
          );
        }
      },
    },
  ];

  //creamos las filas (datos) para datagrid
  useEffect(() => {
    if (props.sales_list) {
      setRows(
        props.sales_list.map((p) => {
          p.id = p.facturacion_id;
          return p;
        })
      );
    }
  }, [props.sales_list]);
  /* const rows=props.sales_list.map(p => {
        p.id = p.facturacion_id;
        return p;
    }); */

  //consulta los registros de ventas
  useEffect(() => {
    if (props.tabKey === "salesList") {
      props.getAllSales();
    }
  }, [props.set_crud_sale]);

  //funcion filtar los items segun el valor de search
  function filter(rows) {
    return rows.filter(
      (row) =>
        row.razon_social_nombre.toLowerCase().indexOf(search.toLowerCase()) > -1
    );
  }
  return (
    <>
      <div className="card-header">
        <Row>
          <h3 className="card-title">Lista de ventas</h3>
        </Row>
      </div>
      <div className="card-body">
        <div className="row justify-content-end">
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-6 form-inline my-2 my-lg-0">
            <label
              onClick={() => {
                console.log(esES.props.MuiDataGrid.localeText);
              }}
              className="form-label mr-2"
              htmlFor="search"
            >
              Ingresar criterio de busqueda:
            </label>
            <input
              className="form-control"
              style={{ width: "55%" }}
              id="search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div
          style={{ height: 420, width: "100%" }}
          className="mt-2  position-relative"
        >
          <Loader show={!props.sales_list} center={true} />
          <div style={{ width: "100%", height: "100%" }}>
            {props.sales_list ? (
              <DataGrid
                /* onRowClick={({row})=>{console.log(row);}} */ localeText={
                  esES.props.MuiDataGrid.localeText
                }
                hideFooter={true}
                rows={filter(rows)}
                columns={columns}
                hideFooterSelectedRowCount={true}
                rowHeight={45}
                disableColumnMenu={true}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
        {props.tabKey === "salesList" ? (
          <EditSalesModal
            tabKey={props.tabKey}
            statusModal={editSalesModal}
            hideModal={hideEditSalesModal}
            showUnitMeasureModal={showUnitMeasureModal}
            unitMeasureSelect={unitMeasureSelect}
            setProductId={setProductId}
            unitMeasureModal={unitMeasureModal}
            setUnitMeasureSelect={setUnitMeasureSelect}
          />
        ) : (
          <></>
        )}

        {props.tabKey === "salesList" ? (
          <UnitMeasureModal
            statusModal={unitMeasureModal}
            hideModal={hideUnitMeasureModal}
            productId={productId}
            setUnitMeasureSelect={setUnitMeasureSelect}
            resetDataProduct={() => {
              return;
            }}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    sales_list: state.app.sales.sales_list,
    set_crud_sale: state.app.sales.set_crud_sale,
    userRole: state.auth.user[0],
    openings: state.app.manageCash.openings,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getAllSales: (iduser) => dispatch(Actions.getAllSales(iduser)),
    getInfoSales: (idSales) => dispatch(Actions.getInfoSales(idSales)),
    updateStatusBySales: (idSales) =>
      dispatch(Actions.updateStatusBySales(idSales)),
    getPriceDollar: () => dispatch(Actions.getPriceDollar()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDragDropContext(SalesList));
