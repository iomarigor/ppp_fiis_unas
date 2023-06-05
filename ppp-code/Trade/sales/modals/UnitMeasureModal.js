import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import withDragDropContext from "../helper/withDnDContext";
import * as Actions from "store/actions/app";
import Loader from "../../helpers/loader/Loader";
const UnitMeasureModal = (props) => {
  //se consultan los registro de unidad de medida segun producto
  useEffect(() => {
    if (props.statusModal) {
      props.getAllUnitMeasuresByProduct(props.productId);
    }
  }, [props.statusModal]);

  //Valida si exiten unidades registradas para el producto
  useEffect(() => {
    if (props.statusModal) {
      if (props.unitmeasureproduct.length === 0) {
        toast.error("Aun no se registraron medidas");
        props.resetDataProduct();
        props.hideModal();
      }
    }
  }, [props.unitmeasureproduct]);

  //se parcean y asignan los registroa a datagrid
  const rows = props.unitmeasureproduct.map((p) => {
    p.id = p.unidad_medida_id + "-" + p.producto_id;
    p.precioventaID = "precioventa";
    return p;
  });

  //se inicializan las columnas de datagrid
  const columns = [
    { field: "id", headerName: "ID", hide: true, identify: true },
    {
      field: "unidad_medida_id",
      headerName: "Medida",
      headerAlign: "center",
      flex: 1,
      disableClickEventBuddling: true,
      renderCell: (params) => {
        const brands = props.unitmeasures.filter(
          (brand) =>
            parseInt(brand.unidad_medida_id) ===
            parseInt(params.row.unidad_medida_id)
        );
        if (brands[0] !== undefined) {
          const brand = brands[0];
          return brand.unidad_medida;
        } else {
          return "denominación no encontrada";
        }
      },
    },
    {
      field: "tipo_precio",
      headerName: "Tipo precio",
      headerAlign: "center",
      width: 110,
      disableClickEventBuddling: true,
      renderCell: (params) => {
        //const [precioID,setPrecioID]=useState('precioventa');
        /* let precioID="precioventa"; */
        let prices = [];
        prices.push({
          id: "precioventa",
          name: "Precio Venta",
          val: params.row.precioventa,
        });
        prices.push({
          id: "precio1",
          name: "Precio 1",
          val: params.row.precio1,
        });
        prices.push({
          id: "precio2",
          name: "Precio 2",
          val: params.row.precio2,
        });
        prices.push({
          id: "precio3",
          name: "Precio 3",
          val: params.row.precio3,
        });
        prices.push({
          id: "preciocredito",
          name: "Precio credito",
          val: params.row.preciocredito,
        });
        return (
          <select
            className="form-select"
            value={params.row.precioventaID}
            onChange={(e) => {
              params.row.precioventaID = e.target.value;
              params.row.precioventa = prices.filter((p) => {
                return p.id === e.target.value;
              })[0].val;
            }}
            data-toggle="tooltip"
            data-placement="right"
            title="Selecciona el precio"
          >
            <option value={0} disabled>
              Seleccionar
            </option>
            {prices
              .filter((p) => p.val !== "0.00")
              .map((price) => {
                return (
                  <option value={price.id} key={price.id}>
                    {" "}
                    {price.name}{" "}
                  </option>
                );
              })}
          </select>
        );
      },
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      headerAlign: "center",
      type: "number",
      width: 90,
    },
    {
      field: "precioventa",
      headerName: "Precio",
      headerAlign: "center",
      type: "number",
      width: 80,
    },
  ];

  //se resetean y ocultan el modal
  const hideModal = () => {
    props.resetDataProduct();
    props.hideModal();
  };
  return (
    <div>
      <Modal
        size="md"
        show={props.statusModal}
        onHide={hideModal}
        backdrop="static"
        centered
      >
        <form>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col xl={12}>
                  <div
                    style={{ height: 200, width: "100%" }}
                    className="mt-2 position-relative"
                  >
                    <Loader
                      show={
                        props.unitmeasureproduct.length === 0 ? true : false
                      }
                      center={true}
                    />
                    <div style={{ width: "100%", height: "100%" }}>
                      <DataGrid
                        /* onRowClick={({row})=>{console.log(row);}} */ rows={
                          rows
                        }
                        columns={columns}
                        /* autoPageSize={true} */ /* pageSize={2} */ hideFooter={
                          true
                        }
                        /* hideFooterSelectedRowCount={true} */ rowHeight={45}
                        disableColumnMenu={true}
                        onCellClick={(e) => {
                          if (e.field !== "tipo_precio") {
                            props.setUnitMeasureSelect(e.row);
                            props.hideModal();
                          }
                        }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </form>
      </Modal>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    unitmeasureproduct: state.app.products.unitmeasureproduct,
    unitmeasures: state.app.products.unitmeasures,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getAllUnitMeasuresByProduct: (product) =>
      dispatch(Actions.getAllUnitMeasuresByProduct(product)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDragDropContext(UnitMeasureModal));
