import React, { Component } from 'react';
import {
  Table, 
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';

class FormProduct extends Component {

  state = {
    model:{
      id:0,
      nombres:'',
      valor:0, 
      descripcion:''
    }
  }

  setValues = (e, field) => {
    const {model} = this.state;
    model[field] = e.target.value;
    this.setState({model});
  }

  create = () => {
    console.log(this.props);
    let data = {
      id: parseInt(this.state.model.id),
      nombres: this.state.model.nombres,
      valor: parseInt(this.state.model.valor),
      descripcion: this.state.model.descripcion,
    }
    this.props.productCreate(data);
  }

  render(){
    return(
      <Form>
        <FormGroup>
          <div className="form-row">
            <div className="col-md-6">
              <Label for="nombres">Nombre:</Label>
              <Input id="nombres" type="text" value={this.state.model.nombres} onChange={e => this.setValues(e, 'nombres')} placeholder="Nombres"/>
            </div>
            <div className="col-md-6">
              <Label for="valor">Valor:</Label>
              <Input id="valor" type="number" value={this.state.model.valor} onChange={e => this.setValues(e, 'valor')} placeholder="Valor"/>
            </div>
          </div>
        </FormGroup>
        <FormGroup>
          <Label for="descripcion">Descripción:</Label>
          <Input id="descripcion" type="textarea" rows="4" value={this.state.model.descripcion} onChange={e => this.setValues(e, 'descripcion')} placeholder="Descripción"/>
        </FormGroup>
        <Button color="primary" onClick={this.create} block>Guardar</Button>
      </Form>
    )
  }
}

class ListProduct extends Component {

  delete = (id) => {
    this.props.deleteProduct(id);
  }

  render(){
    const { products} = this.props;
    return(
      <Table className="table-bordered text-center table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {
            products.map(product => (
              <tr key={product.id}>
                <td>{product.nombres}</td>
                <td>{product.descripcion}</td>
                <td>{product.valor}</td>
                <td>
                  <Button color="info" size="sm">Edit</Button>
                  <Button color="danger" size="sm" onClick={e => this.delete(product.id)}>Delete</Button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    )
  }
}

export default class ProductBox extends Component {

  Url = 'http://127.0.0.1:8000/'

  state = {
    products : []
  }

  

  componentDidMount(){
    fetch(this.Url+'getProductos')
      .then(response => response.json())
      .then( data => this.setState({ products: data.productos}))
      .catch(e => console.log(e));
  }

  create = (product) => {
    
    const requestInfo = {
      method:'POST',
      body: JSON.stringify(product),
      headers: new Headers({
        'Content-type':'application/json'
      })
    };

    fetch(this.Url+'saveProducto', requestInfo)
      .then(response => response.json())
      .then( data => {
        let {products} = this.state;
        products.push(data.producto);
        this.setState({ products });
      })
      .catch(e => console.log(e));
  }

  delete = (id) => {

    const requestInfo = {
      method:'POST',
      body: JSON.stringify({'id':id}),
      headers: new Headers({
        'Content-type':'application/json'
      })
    };

    fetch(this.Url+'deleteProducto', requestInfo)
      .then(response => response.json())
      .then( rows => {
        const products = this.state.products.filter(product => product.id !== id);
        this.setState({products});
      })
      .catch(e => console.log(e));
  }

  render(){
    return(
      <div className="row">
        <div className="col-md-6">
          <h2 className="font-weight-bold text-center">Module Products</h2>
          <FormProduct productCreate={this.create} />
        </div>
        <div className="col-md-6">
          <h2 className="font-weight-bold text-center">List Products</h2>
          <ListProduct products={this.state.products} deleteProduct={this.delete}/>
        </div>
      </div>
    )
  }
}
