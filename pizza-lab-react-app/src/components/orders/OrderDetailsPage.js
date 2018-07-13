import React, { Component } from 'react'
import OrderDetailsRow from './OrderDetailsRow'
import Auth from '../../utils/auth'
import {fetchUserOrdersAction, fetchPendingOrdersAction} from '../../actions/ordersActions'
import { connect } from 'react-redux'

class OrderDetailsPage extends Component {
  componentWillMount () {
    if (Auth.isUserAdmin()) {
      this.props.fetchPendingOrders()
    } else {
      this.props.fetchUserOrders()
    }
  }

  render () {
    let orders
    if (Auth.isUserAdmin()) {
      if (this.props.pendingOrders.length === 0) {
        return (<h1 />)
      }
      orders = this.props.pendingOrders
    } else {
      if (this.props.userOrders.length === 0) {
        return (<h1 />)
      }
      orders = this.props.userOrders
    }

    let orderId = this.props.match.params.id
    let order = orders.find(o => o._id === orderId)
    if (!order) {
      return (
        <h1>Order not found :(</h1>
      )
    }

    let totalPrice = 0
    for (const product of order.products) {
      totalPrice += product.quantity * product.price
    }

    let products = order.products.map((p, i) => (<OrderDetailsRow key={i} product={p} index={i} />))

    return (
      <div className='container mt-4'>
        <h1 className='text-center'>Order #{order._id}</h1>
        <div className='row space-top'>
          <div className='col-md-12 mt-3'>
            <p><span className='font-weight-bold lead text-warning'>Products In Order:</span> <span className='ml-2 lead'>{order.products.length}</span></p>
            <p><span className='font-weight-bold lead text-warning'>Date:</span> <span className='ml-2 lead'>{new Date(order.date).toLocaleDateString()}</span></p>
            <p><span className='font-weight-bold lead text-warning'>Total Price:</span> <span className='ml-2 lead'>${totalPrice.toFixed(2)}</span></p>
          </div>
        </div>
        <div className='row mt-5'>
          <div className='col-md-12' id='customer-orders'>
            <div className='box'>
              <div className='table-responsive'>
                <table className='table table-hover'>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    userOrders: state.userOrders,
    pendingOrders: state.pendingOrders
  }
}

function mapDispatchToProps (dispatch) {
  return {
    fetchUserOrders: () => dispatch(fetchUserOrdersAction()),
    fetchPendingOrders: () => dispatch(fetchPendingOrdersAction())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailsPage)
