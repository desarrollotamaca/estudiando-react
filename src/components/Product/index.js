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
  render(){
    return(
      <div>

      </div>
    )
  }
}

class ListProduct extends Component {
  render(){
    const { products} = this.props;
    console.log(products);
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
              <tr key={product.idproducto_servicios}>
                <td>{product.nombres}</td>
                <td>{product.descripcion}</td>
                <td>{product.valor}</td>
                <td>
                  <Button color="info" size="sm">Edit</Button>
                  <Button color="danger" size="sm">Delete</Button>
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

  Url = 'https://app.tamaca.com.co/ObtenerProductosPlatos'

  state = {
    products : []
  }

  componentDidMount(){
    fetch(this.Url)
      .then(response => response.json())
      .then( data => this.setState({ products: data.datos}))
      .catch(e => console.log(e));
  }

  render(){
    return(
      <div className="row">
        <div className="col-md-6">
          <h2 className="font-weight-bold text-center">Module Products</h2>
          <FormProduct />
        </div>
        <div className="col-md-6">
          <h2 className="font-weight-bold text-center">List Products</h2>
          <ListProduct products={this.state.products}/>
        </div>
      </div>
    )
  }
}
