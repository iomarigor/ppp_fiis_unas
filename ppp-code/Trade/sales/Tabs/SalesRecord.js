import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Form, Col, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { DataGrid, esES } from "@material-ui/data-grid";
import * as Actions from "store/actions/app";
import withDragDropContext from "../helper/withDnDContext";
import Select from "react-select";
import PaymentModal from "../modals/PaymentModal";
import ReservationModal from "../modals/ReservationModal";
import ConsumptionModal from "../modals/ConsumptionModal";
import ProformaModal from "../modals/ProformaModal";
import UnitMeasureModal from "../modals/UnitMeasureModal";
import textEsESDataGrid from "../../helpers/textDataGrid.js";
const SalesRecord = (props) => {
  const initialsStateValues = {
    codigo_producto: null,
    descripcion: null,
    existencia: null,
    precio_venta: null,
    detalle: null,
  };
  const inputStateValues = {
    reservation: true,
    consumption: true,
    proforma: true,
    additional: true,
  };
  const [paymentModal, setPaymentModal] = useState(false);
  const [reservationModal, setReservationModal] = useState(false);
  const [consumptionModal, setConsumptionModal] = useState(false);
  const [proformaModal, setProformaModal] = useState(false);
  const [unitMeasureModal, setUnitMeasureModal] = useState(false);
  const [unitMeasureSelect, setUnitMeasureSelect] = useState(null);
  const [productId, setProductId] = useState(null);
  const [values, setValues] = useState(initialsStateValues);
  const [input, setInput] = useState(inputStateValues);
  const [cantidad, setCantidad] = useState(0);
  const [igvP, setIgvP] = useState(0);
  const [totalP, setTotalP] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [subTotalP, setSubTotalP] = useState(0);
  const [FProducts, setFProducts] = useState(false);
  const [searchProducts, setSearchProducts] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    props.getAllSales(props.userRole.id);
  }, [props.set_crud_sale]);
  const reservationSelect = () => {
    setInput({
      reservation: true,
      consumption: false,
      proforma: false,
      additional: false,
    });
  };
  const consumptionSelect = () => {
    setInput({
      reservation: false,
      consumption: true,
      proforma: false,
      additional: false,
    });
  };
  const proformaSelect = () => {
    setInput({
      reservation: false,
      consumption: false,
      proforma: true,
      additional: false,
    });
  };
  const additionalSelect = () => {
    setInput({
      reservation: false,
      consumption: false,
      proforma: false,
      additional: true,
    });
  };

  const showUnitMeasureModal = () => {
    setUnitMeasureSelect(null);
    setUnitMeasureModal(true);
  };
  const hideUnitMeasureModal = () => {
    setUnitMeasureModal(false);
    setProductId(null);
  };
  const showPaymentModal = () => {
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
        setPaymentModal(true);
        setFProducts(true);
      }
    } else {
      toast.warning("Obteniendo info...");
    }
  };
  const hidePaymentModal = () => {
    setPaymentModal(false);
    if (rows.length > 0) {
      setFProducts(false);
    }
  };
  const showReservationModal = () => {
    setReservationModal(true);
  };
  const hideReservationModal = () => {
    setReservationModal(false);
  };
  const showConsumptionModal = () => {
    setConsumptionModal(true);
  };
  const hideConsumptionModal = () => {
    setConsumptionModal(false);
  };
  const showProformaModal = () => {
    setProformaModal(true);
  };
  const hideProformaModal = () => {
    setProformaModal(false);
  };
  //se consultan los registros y los productos almacenado en el local storage
  useEffect(() => {
    if (props.tabKey === "salesRecord") {
      props.getAllOpenings();
      props.getAllProducts();
      props.getAllUnitMeasures();
      props.getPriceDollar();
      props.getAllCoinType();
      console.log("userRole: " + props.userRole.sucursal_id);
      props.getDataBranchOptions(props.userRole.sucursal_id);
      const tRows = JSON.parse(localStorage.getItem("arraySales")) || [];
      /* console.log(JSON.parse(localStorage.getItem("arraySales"))) */
      if (JSON.parse(localStorage.getItem("arraySales"))) {
        if (JSON.parse(localStorage.getItem("arraySales")).length >= 1) {
          let tipoInput = JSON.parse(
            localStorage.getItem("arraySales")
          )[0].id.split("-")[0];

          if (tipoInput === "PF") {
            proformaSelect();
          }
          if (tipoInput === "PC") {
            consumptionSelect();
          }
          if (tipoInput === "RC") {
            reservationSelect();
          }
          if (tipoInput !== "PF" && tipoInput !== "PC" && tipoInput !== "RC") {
            additionalSelect();
          }
        }
      }
      setRows(tRows);
      if (tRows.length > 0) {
        // console.log("lStorage");
        setFProducts(false);
        cSubTotalP(JSON.parse(localStorage.getItem("arraySales")) || []);
      }
    }
  }, [props.tabKey]);

  //se calcula subtotal
  useEffect(() => {
    cSubTotalP(JSON.parse(localStorage.getItem("arraySales")) || []);
  }, [props.get_branch_options]);

  const aFProducts = () => {
    setFProducts(false);
  };

  //se resetea los valores de values y se eliminar los productos de localstorage
  const dFProducts = () => {
    setRows([]);
    localStorage.removeItem("arraySales");
    setValues(initialsStateValues);
    //setFProducts(true);
    setIgvP(0);
    setTotalP(0);
    setSubTotalP(0);
    setInput(inputStateValues);
  };

  const handleChange = (selectedOption) => {
    const sTotal = selectedOption.precio_venta * cantidad;
    setProductId(selectedOption.producto_id);
    setSubTotal(sTotal);
    setValues(selectedOption);
    showUnitMeasureModal();
  };

  //se reseta los datos de producto
  const resetDataProduct = () => {
    setProductId(null);
    setSubTotal(0);
    setValues(initialsStateValues);
  };

  //se asignan los registros de producto al search
  useEffect(() => {
    if (props.products) {
      setSearchProducts(
        props.products
          .filter((p) => p.producto_id != 2)
          .map((p) => {
            p.id = p.producto_id;
            p.label = p.denominacion;
            p.value = p.producto_id;
            return p;
          })
          .filter((product) => product.estado == 1)
      );
    }
  }, [props.products]);
  /* const searchProducts=props.products.map(p => {
        p.id = p.producto_id;
        p.label= p.denominacion;
        p.value= p.producto_id;
        return p;
    }).filter( product=> product.estado===1); */

  //se inicializan las comunas de datagrid
  const columns = [
    {
      field: "",
      headerName: "Acciones",
      headerAlign: "center",
      width: 110,
      disableClickEventBuddling: true,
      renderCell: (params) => {
        //Elimina producto de datagrid
        const onClickDelete = () => {
          const thisRow = params.row;
          deleteproductRow(thisRow);
        };
        return (
          <>
            <Button
              onClick={onClickDelete}
              variant="danger"
              data-toggle="tooltip"
              data-placement="right"
              title="Eliminar"
            >
              <i className="fas fa-trash-alt"></i>
            </Button>
          </>
        );
      },
    },
    { field: "id", hide: true, identify: true },
    {
      field: "index",
      headerName: "#",
      headerAlign: "center",
      width: 60,
      disableClickEventBuddling: true,
      renderCell: (params) => {
        return rows.indexOf(params.row) + 1;
      },
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      headerAlign: "center",
      type: "number",
      width: 95,
    },
    {
      field: "unidad_medida_id",
      headerName: "UM",
      headerAlign: "center",
      width: 80,
      disableClickEventBuddling: true,
      renderCell: (params) => {
        //capturo la marca del producto
        if (props.unitmeasures) {
          const brands = props.unitmeasures.filter(
            (brand) =>
              parseInt(brand.unidad_medida_id) ===
              parseInt(params.row.unidad_medida_id)
          );
          if (brands[0] !== undefined) {
            const brand = brands[0];
            return brand.abreviatura;
          } else {
            return params.row.abreviatura;
          }
        }
        return "";
      },
    },
    {
      field: "denominacion",
      headerName: "Descripción",
      headerAlign: "center",
      width: 180,
      disableClickEventBuddling: true,
      renderCell: ({ row }) => {
        if (row.detalle && row.detalle.length > 0) {
          return row.denominacion + " - " + row.detalle;
        } else {
          return row.denominacion;
        }
      },
      flex: 1,
    },
    {
      field: "precio_venta",
      headerName: "Precio",
      headerAlign: "center",
      type: "number",
      width: 95,
    },
    {
      field: "importe",
      headerName: "Importe",
      headerAlign: "center",
      type: "number",
      width: 95,
    },
  ];

  //calcula la cantidad
  const cantidadInputChange = (e) => {
    let { name, value } = e.target;
    value = parseFloat(value);
    setCantidad(value);
    const sTotal = values.precio_venta * value;
    setSubTotal(sTotal);
  };

  //calcula el subtotal
  const sTotalInputChange = (e) => {
    let { name, value } = e.target;
    value = parseFloat(value);
    setSubTotal(value);
  };

  //actualiza los valores de values
  const handleInputChange = (e) => {
    if (e.target.type === "checkbox") {
      var { name, checked } = e.target;
      checked = checked === true ? 1 : 0;
      setValues({ ...values, [name]: checked });
    }
    if (e.target.type === "text") {
      const { name, value } = e.target;
      setValues({ ...values, [name]: value });
    }
    if (e.target.type === "select-one") {
      const { name, value } = e.target;
      setValues({ ...values, [name]: parseInt(value) });
    }
    if (e.target.type === "number") {
      let { name, value } = e.target;
      value = parseFloat(value);
      setValues({ ...values, [name]: value });
      if (name === "precio_venta") {
        const stotal = value * cantidad;
        setSubTotal(stotal);
      }
    }
  };

  //se agrega producto al datagrid y se calcula el subtotal
  const addProductReservation = (products) => {
    const tRows = JSON.parse(JSON.stringify(rows));
    products.map((product) => {
      tRows.push(product);
    });
    setRows(tRows);
    cSubTotalP(tRows);
    localStorage.setItem("arraySales", JSON.stringify(tRows));
    /*  
            codigo_producto
            descripcion
            cantidad
            importe
            descuento */
  };

  //se valida y agregan los productos al datagrid
  const addProduct = () => {
    if (values.codigo_producto === null && values.descripcion === null) {
      toast.error("Aun no seleccionó un producto");
      return;
    }
    if (cantidad === 0) {
      toast.error("Aun no ingreso la cantidad");
      return;
    }
    let tProduct = rowDuplicate(rows, values);

    if (tProduct === null) {
      let tValues = values;
      tValues.id = tValues.id + "-" + unitMeasureSelect.unidad_medida_id;
      tValues.cantidad = cantidad;
      tValues.importe = subTotal;
      tValues.descuento = 0;
      tValues.unidad_medida_id = unitMeasureSelect.unidad_medida_id;
      setRows([...rows, tValues]);
      cSubTotalP([...rows, tValues]);
      localStorage.setItem("arraySales", JSON.stringify([...rows, tValues]));
    } else {
      let tRows = JSON.parse(JSON.stringify(rows));
      toast.warn(
        "Item duplicado, se sumaron cantidades y se actualizo el detalle adicional"
      );
      tProduct.cantidad += cantidad;
      tProduct.importe += subTotal;
      tProduct.detalle = values.detalle;
      tProduct.descuento = 0;
      tRows[rows.indexOf(tProduct)] = tProduct;
      setRows(tRows);
      cSubTotalP(tRows);
      localStorage.setItem("arraySales", JSON.stringify(tRows));
    }
    setUnitMeasureSelect(null);
    setValues(initialsStateValues);
    setCantidad(0);
    setSubTotal(0);
    additionalSelect();
  };

  //retorna producto duplicado en datagrid
  const rowDuplicate = (arrayP, product) => {
    for (let i = 0; i < arrayP.length; i++) {
      console.log(
        arrayP[i].id +
          " = " +
          product.id +
          "-" +
          unitMeasureSelect.unidad_medida_id
      );
      if (
        arrayP[i].id ===
        product.id + "-" + unitMeasureSelect.unidad_medida_id
      ) {
        return arrayP[i];
      }
    }

    return null;
  };

  //elimina producto de datagrid
  const deleteproductRow = (product) => {
    setRows(
      rows.filter((row) => {
        return row !== product;
      })
    );
    if (
      rows.filter((row) => {
        return row !== product;
      }).length >= 1
    ) {
      localStorage.setItem(
        "arraySales",
        JSON.stringify(
          rows.filter((row) => {
            return row !== product;
          })
        )
      );
    } else {
      localStorage.removeItem("arraySales");
    }

    cSubTotalP(
      rows.filter((row) => {
        return row !== product;
      })
    );
    if (
      rows.filter((row) => {
        return row !== product;
      }).length === 0
    ) {
      setInput(inputStateValues);
    }
  };

  //calcula igv, subtotal y total
  const cSubTotalP = (arrayP) => {
    let subtotal = 0;
    let total = 0;
    let igv = 0;
    arrayP.forEach((p) => {
      subtotal += p.importe;
    });
    if (props.get_branch_options) {
      if (props.get_branch_options.igv === 1) {
        console.log("igv: " + props.get_branch_options.porcentaje_igv);
        igv =
          subtotal *
          (parseFloat(props.get_branch_options.porcentaje_igv) / 100);
      }
    }
    total = igv + subtotal;
    setIgvP(igv.toFixed(2));
    setSubTotalP(subtotal.toFixed(2));
    setTotalP(total.toFixed(2));
  };

  //se asigna el precio del producto segun su unidad de medida
  useEffect(() => {
    if (props.tabKey === "salesRecord" && unitMeasureSelect) {
      setValues({ ...values, precio_venta: unitMeasureSelect.precioventa });
    }
  }, [unitMeasureSelect]);

  return (
    <>
      <div className="card-header">
        <Row>
          <h3 className="card-title">Ingreso de producto</h3>
        </Row>
        {/* <Row>
          <Col>
            {input.reservation ? (
              <Button
                variant="success"
                md={3}
                className="mt-3"
                onClick={showReservationModal}
              >
                Ver reservas
              </Button>
            ) : (
              <></>
            )}
            {input.consumption ? (
              <Button
                variant="dark"
                md={3}
                className="ml-3 mt-3"
                onClick={showConsumptionModal}
              >
                Ver pedido / Consumo
              </Button>
            ) : (
              <></>
            )}
            {input.proforma ? (
              <Button
                variant="secondary"
                className="border border-dark ml-3 mt-3"
                md={3}
                onClick={showProformaModal}
              >
                Ver proforma
              </Button>
            ) : (
              <></>
            )}
          </Col>
        </Row> */}
      </div>
      <div className="card-body">
        <Row>
          {/* <Col xl={2} md={2} sm={2}>
            <label className="form-label">Codigo:</label>
            <input
              className="form-control"
              readOnly={!input.additional}
              value={values.codigo_producto || ""}
              type="text"
              name="codigo_producto"
              onChange={handleInputChange}
            />
          </Col> */}
          <Col xl={3} md={2} sm={2}>
            <label className="form-label">Descripción del producto:</label>
            <Select
              value={values}
              onChange={handleChange}
              options={searchProducts}
              isDisabled={!input.additional}
            />
          </Col>
          <Col xl={3} md={2} sm={2}>
            <label className="form-label">Descripción adicional:</label>
            <input
              className="form-control"
              readOnly={!input.additional}
              value={values.detalle || ""}
              type="text"
              name="detalle"
              onChange={handleInputChange}
            />
          </Col>
          <Col xl={2} md={3} sm={3}>
            <label className="form-label">Precio:</label>
            <input
              className="form-control"
              min="0"
              step="0.1"
              readOnly={!input.additional}
              value={values.precio_venta || ""}
              type="number"
              name="precio_venta"
              onChange={handleInputChange}
            />
          </Col>
          <Col xl={1} md={2} sm={2}>
            <label className="form-label">Cantidad:</label>
            <input
              className="form-control"
              min="0"
              step="0.1"
              readOnly={!input.additional}
              value={cantidad || ""}
              type="number"
              name="cantidad"
              onChange={cantidadInputChange}
            />
          </Col>
          <Col xl={2} md={3} sm={3}>
            <label className="form-label">SubTotal:</label>
            <input
              className="form-control"
              step="0.1"
              min="0"
              readOnly={!input.additional}
              value={subTotal || ""}
              type="number"
              name="subtotal"
              onChange={sTotalInputChange}
            />
          </Col>
          <Col
            xl={1}
            md={1}
            sm={2}
            className="d-flex align-items-end justify-content-end my-3 my-xl-0"
          >
            {input.additional ? (
              <Button
                variant="success"
                style={{ width: 40, heigth: 40 }}
                onClick={addProduct}
                className="rounded-circle"
              >
                <i className="fas fa-plus "></i>
              </Button>
            ) : (
              <></>
            )}
          </Col>
        </Row>
        <Row>
          <div style={{ height: 335, width: "100%" }} className="mt-2">
            <DataGrid
              onRowClick={({ row }) => {
                console.log(row);
              }}
              localeText={esES.props.MuiDataGrid.localeText}
              hideFooter={true}
              hideFooterSelectedRowCount={true}
              rows={rows}
              columns={columns}
              /* pageSize={5}  */ rowHeight={45}
              disableColumnMenu={true}
            />
          </div>
        </Row>
        <Row className="d-flex justify-content-between mt-3">
          <Row className="d-flex justify-content-xl-center justify-content-md-start">
            <Col xl={2} md={3} className="my-md-3 my-3 my-xl-0">
              <label className="form-label">Sub Total:</label>
              <input
                className="form-control"
                value={subTotalP || ""}
                type="text"
                placeholder="0"
                readOnly
              />
            </Col>
            <Col xl={2} md={3} className="my-md-3 mb-3 my-xl-0">
              <label className="form-label">IGV:</label>
              <input
                className="form-control"
                value={igvP || ""}
                type="text"
                placeholder="0"
                readOnly
              />
            </Col>
            <Col xl={2} md={3} className="my-md-3 mb-3 my-xl-0">
              <label className="form-label">Descuento:</label>
              <input
                className="form-control"
                value={values.descuento || ""}
                type="number"
                placeholder="0"
                name="descuento"
                onChange={handleInputChange}
              />
            </Col>
            <Col xl={2} md={3} className="my-md-3 mb-3 my-xl-0">
              <label className="form-label">ICBPER:</label>
              <input
                className="form-control"
                value={values.otros_impuestos || ""}
                type="text"
                placeholder="0"
                readOnly
              />
            </Col>
            <Col xl={2} md={3} className="my-md-3 mb-3 my-xl-0">
              <label className="form-label">Total:</label>
              <input
                className="form-control"
                value={totalP || ""}
                type="text"
                placeholder="0"
                readOnly
              />
            </Col>
          </Row>
          <Col className="d-flex justify-content-md-end justify-content-sm-end py-3 align-items-end">
            <Button variant="warning" md={2} onClick={dFProducts}>
              Limpiar
            </Button>
            {rows.length === 0 ? (
              ""
            ) : (
              <Button
                md={2}
                variant="success"
                className="ml-3"
                onClick={showPaymentModal}
              >
                Cobrar
              </Button>
            )}
          </Col>
        </Row>
        <PaymentModal
          tabKey={props.tabKey}
          statusModal={paymentModal}
          hideModal={hidePaymentModal}
          sTotalP={subTotalP}
          igvP={igvP}
          totalP={totalP}
          clearRow={dFProducts}
        />
        <ReservationModal
          reservationSelect={reservationSelect}
          addProductReservation={addProductReservation}
          statusModal={reservationModal}
          hideModal={hideReservationModal}
        />
        <ConsumptionModal
          consumptionSelect={consumptionSelect}
          addProductReservation={addProductReservation}
          statusModal={consumptionModal}
          hideModal={hideConsumptionModal}
        />
        <ProformaModal
          proformaSelect={proformaSelect}
          addProductReservation={addProductReservation}
          statusModal={proformaModal}
          hideModal={hideProformaModal}
        />
        <UnitMeasureModal
          statusModal={unitMeasureModal}
          hideModal={hideUnitMeasureModal}
          productId={productId}
          setUnitMeasureSelect={setUnitMeasureSelect}
          resetDataProduct={resetDataProduct}
        />
      </div>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    products: state.app.products.products,
    unitmeasures: state.app.products.unitmeasures,
    userRole: state.auth.user[0],
    openings: state.app.manageCash.openings,
    get_branch_options: state.app.establishment.get_branch_options,
    set_crud_sale: state.app.sales.set_crud_sale,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getAllProducts: () => dispatch(Actions.getAllProducts()),
    getAllUnitMeasures: () => dispatch(Actions.getAllUnitMeasures()),
    getDataBranchOptions: (branchId) =>
      dispatch(Actions.getDataBranchOptions(branchId)),
    getAllCoinType: () => dispatch(Actions.getAllCoinType()),
    getAllOpenings: () => dispatch(Actions.getAllOpenings()),
    getPriceDollar: () => dispatch(Actions.getPriceDollar()),
    getAllSales: (iduser) => dispatch(Actions.getAllSales(iduser)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDragDropContext(SalesRecord));
