import React, { Component } from 'react';
import PubSub from 'pubsub-js';

import {
  Table, 
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert
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
    this.props.productCreate(this.state.model);
    this.setState({model:{id:0,nombres:'',valor:0, descripcion:''}})
  }

  componentWillMount(){
    PubSub.subscribe('edit-product', (topic, product) => {
      this.setState({model:product});
    })
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

  onEdit = (product) => {
    PubSub.publish('edit-product', product);
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
                  <Button color="info" size="sm" onClick={e => this.onEdit(product)}>Edit</Button>
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
    products : [],
    message: {
      text: '',
      alert: ''
    }
  }

  

  componentDidMount(){
    fetch(this.Url+'getProductos')
      .then(response => response.json())
      .then( data => this.setState({ products: data.productos}))
      .catch(e => console.log(e));
  }

  save = (product) => {
    
    let data = {
      id: parseInt(product.id),
      nombres: product.nombres,
      valor: parseInt(product.valor),
      descripcion: product.descripcion,
    } 

    const requestInfo = {
      method:'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-type':'application/json'
      })
    };

    if(data.id === 0){
      fetch(this.Url+'saveProducto', requestInfo)
      .then(response => response.json())
      .then( data => {
        let {products} = this.state;
        products.push(data.producto);
        this.setState({ products, message:{text: 'Producto agregado exitosamente', alert:'success'} });
      })
      .catch(e => console.log(e));
    }else{
      fetch(this.Url+'editProducto', requestInfo)
      .then(response => response.json())
      .then( data => {
        let {products} = this.state;
        let position = products.findIndex(product => product.id === data.id);
        products[position] = data.producto;
        this.setState({ products, message:{text: 'Producto actualizado exitosamente', alert:'info'} });
      })
      .catch(e => console.log(e));
    }
    this.timerMessage(3000);

    /*const requestInfo = {
      method:'POST',
      body: JSON.stringify(data),
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
      .catch(e => console.log(e));*/
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
        this.setState({products, message:{text: 'Producto eliminado exitosamente', alert:'danger'}});
        this.timerMessage(3000);
      })
      .catch(e => console.log(e));
  }

  timerMessage = (duration) => {
    setTimeout(()=>{
        this.setState({message: {text:'', alert:''}});
    }, duration)
  }

  render(){
    return(
      <div className="row">
        <div className="col-md-12">
          {
            this.state.message.text !== '' ? (
              <Alert color={this.state.message.alert}>{this.state.message.text}</Alert>
            ) : ''
          }
        </div>
       

        <div className="col-md-6">
          <h2 className="font-weight-bold text-center">Module Products</h2>
          <FormProduct productCreate={this.save} />
        </div>
        <div className="col-md-6">
          <h2 className="font-weight-bold text-center">List Products</h2>
          <ListProduct products={this.state.products} deleteProduct={this.delete}/>
        </div>
      </div>
    )
  }
}
