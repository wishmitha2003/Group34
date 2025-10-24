import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  CreditCardIcon,
  TruckIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  UploadIcon,
  FileIcon,
  ClockIcon,
  DownloadIcon,
  Banknote
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/**
 * @typedef {'card' | 'bank_slip' | 'cash_on_delivery'} PaymentMethod
 * @typedef {'pending' | 'awaiting_approval' | 'approved' | 'completed'} OrderStatus
 * @typedef {{
 *   id: string;
 *   date: string;
 *   status: OrderStatus;
 *   items: any[];
 *   totalPrice: number;
 *   transportFee: number;
 *   finalTotal: number;
 *   shippingInfo: {
 *     fullName: string;
 *     address: string;
 *     phoneNumber: string;
 *   };
 *   paymentMethod: PaymentMethod;
 *   transportOption?: 'in_southern' | 'out_southern';
 *   slipImage?: string;
 * }} OrderDetails
 */

const Checkout = () => {
  const { user, isAuthenticated } = useAuth();
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Pre-fill form with user data from profile
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phoneNumber: ''
  });

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderComplete, setOrderComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [orderStatus, setOrderStatus] = useState('pending');
  const [orderId, setOrderId] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [transportOption, setTransportOption] = useState(null);

  // Calculate transport fee
  const transportFee = transportOption === 'in_southern' ? 500 : transportOption === 'out_southern' ? 800 : 0;
  
  // Calculate final total
  const finalTotal = totalPrice + transportFee;

  // Auto-fill form with user profile data when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user?.name || user?.fullName || '',
        address: user?.address || '',
        phoneNumber: user?.phone || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowPaymentOptions(true);
    }
  };

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
    // Clear slip file if not bank slip
    if (method !== 'bank_slip') {
      setSlipFile(null);
      setSlipPreview(null);
    }
    // Clear transport option when switching payment methods
    setTransportOption(null);
    // Clear any existing errors
    setErrors({});
  };

  const handleTransportOption = (option) => {
    setTransportOption(option);
    // Clear transport error when user selects an option
    if (errors.transport) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.transport;
        return newErrors;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSlipFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipPreview(reader.result);
      };
      reader.readAsDataURL(file);
      // Clear file error if exists
      if (errors.slip) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.slip;
          return newErrors;
        });
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const generateOrderId = () => {
    const timestamp = Date.now().toString();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `GZ-${timestamp.slice(-6)}-${randomNum}`;
  };

  const handleCompleteOrder = () => {
    if (!paymentMethod) {
      setErrors({ payment: 'Please select a payment method' });
      return;
    }

    // Don't allow card payments for this demo
    if (paymentMethod === 'card') {
      setErrors({
        payment: 'Credit card payment is currently unavailable. Please choose another payment method.'
      });
      return;
    }

    // Check if cash on delivery is selected but no transport option chosen
    if (paymentMethod === 'cash_on_delivery' && !transportOption) {
      setErrors({ transport: 'Please select a delivery area' });
      return;
    }

    // Check if bank slip is selected but no file uploaded
    if (paymentMethod === 'bank_slip' && !slipFile) {
      setErrors({ slip: 'Please upload your payment slip' });
      return;
    }

    setIsProcessing(true);
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);

    const newOrderDetails = {
      id: newOrderId,
      date: new Date().toISOString(),
      status: paymentMethod === 'bank_slip' ? 'awaiting_approval' : 'completed',
      items: cart,
      totalPrice: totalPrice,
      transportFee: transportFee,
      finalTotal: finalTotal,
      shippingInfo: {
        fullName: formData.fullName,
        address: formData.address,
        phoneNumber: formData.phoneNumber
      },
      paymentMethod: paymentMethod,
      transportOption: transportOption,
      slipImage: slipPreview || undefined
    };

    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      setOrderStatus(paymentMethod === 'bank_slip' ? 'awaiting_approval' : 'completed');
      setOrderDetails(newOrderDetails);

      // Save order to localStorage
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      orders.push(newOrderDetails);
      localStorage.setItem('orders', JSON.stringify(orders));

      // Clear cart
      clearCart();

      // Simulate admin approval for bank slip after 10 seconds
      if (paymentMethod === 'bank_slip') {
        setTimeout(() => {
          setOrderStatus('approved');
          const updatedOrders = orders.map(order =>
            order.id === newOrderId ? { ...order, status: 'approved' } : order
          );
          localStorage.setItem('orders', JSON.stringify(updatedOrders));
          setOrderDetails(prev => prev ? { ...prev, status: 'approved' } : null);
        }, 10000);
      }
    }, 2000);
  };

  const generateInvoice = () => {
    if (!orderDetails) return;

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #${orderDetails.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, .15); }
          .invoice-box table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
          .invoice-box table td { padding: 8px; vertical-align: top; }
          .invoice-box table tr.top table td { padding-bottom: 20px; }
          .invoice-box table tr.top table td.title { font-size: 45px; line-height: 45px; color: #333; }
          .invoice-box table tr.information table td { padding-bottom: 40px; }
          .invoice-box table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; }
          .invoice-box table tr.details td { padding-bottom: 20px; }
          .invoice-box table tr.item td { border-bottom: 1px solid #eee; }
          .invoice-box table tr.item.last td { border-bottom: none; }
          .invoice-box table tr.total td { border-top: 2px solid #eee; font-weight: bold; }
          @media only print { 
            .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, .15); } 
            body { -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <table cellpadding="0" cellspacing="0">
            <tr class="top">
              <td colspan="4">
                <table>
                  <tr>
                    <td class="title">
                      <h2>GenZsport</h2>
                    </td>
                    <td style="text-align: right;">
                      Invoice #: ${orderDetails.id}<br>
                      Created: ${new Date(orderDetails.date).toLocaleDateString()}<br>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr class="information">
              <td colspan="4">
                <table>
                  <tr>
                    <td>
                      GenZsport, Inc.<br>
                      123 Sports Avenue<br>
                      Sports City, SC 12345
                    </td>
                    <td style="text-align: right;">
                      ${orderDetails.shippingInfo.fullName}<br>
                      ${orderDetails.shippingInfo.address}<br>
                      ${orderDetails.shippingInfo.phoneNumber}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr class="heading">
              <td>Payment Method</td>
              <td colspan="3">${orderDetails.paymentMethod === 'bank_slip' ? 'Bank Transfer' : 
                               orderDetails.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 
                               'Credit Card'}</td>
            </tr>
            <tr class="details">
              <td>Delivery Area</td>
              <td colspan="3">${orderDetails.transportOption === 'in_southern' ? 'In Southern Province' : 
                               orderDetails.transportOption === 'out_southern' ? 'Out of Southern Province' : 
                               'N/A'}</td>
            </tr>
            <tr class="heading">
              <td>Item</td>
              <td>Quantity</td>
              <td>Price</td>
              <td>Total</td>
            </tr>
            ${orderDetails.items.map(item => `
              <tr class="item">
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>Rs ${item.price.toFixed(2)}</td>
                <td>Rs ${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr class="total">
              <td colspan="3">Subtotal:</td>
              <td>Rs ${orderDetails.totalPrice.toFixed(2)}</td>
            </tr>
            ${orderDetails.transportFee > 0 ? `
            <tr class="total">
              <td colspan="3">Transport Fee:</td>
              <td>Rs ${orderDetails.transportFee.toFixed(2)}</td>
            </tr>
            ` : ''}
            <tr class="total">
              <td colspan="3"><strong>Final Total:</strong></td>
              <td><strong>Rs ${orderDetails.finalTotal.toFixed(2)}</strong></td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = function() {
        printWindow.print();
      };
    }
  };

  // Show login prompt if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="bg-yellow-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <AlertCircleIcon className="h-12 w-12 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please log in to proceed with checkout. Your profile information will be automatically filled in.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          {orderStatus === 'awaiting_approval' ? (
            <>
              <div className="flex items-center justify-center mb-6">
                <div className="bg-yellow-100 rounded-full w-24 h-24 flex items-center justify-center">
                  <ClockIcon className="h-12 w-12 text-yellow-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">Payment Under Review</h2>
              <p className="text-gray-600 mb-8 text-center">
                Thank you for your order. Your payment slip has been received and is awaiting approval.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Order Details</h3>
                <p className="text-sm text-gray-600">Order Number: <span className="font-medium">{orderId}</span></p>
                <p className="text-sm text-gray-600">Date: <span className="font-medium">{new Date().toLocaleDateString()}</span></p>
                <p className="text-sm text-gray-600">Total: <span className="font-medium">Rs{finalTotal.toFixed(2)}</span></p>
                <p className="text-sm text-gray-600">Status: <span className="font-medium text-yellow-600">Awaiting Approval</span></p>
              </div>
              <div className="border rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-2">Uploaded Payment Slip</h3>
                {slipPreview && (
                  <div className="flex justify-center mb-2">
                    <img src={slipPreview} alt="Payment slip" className="max-h-40 object-contain border rounded" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </>
          ) : orderStatus === 'approved' ? (
            <>
              <div className="flex items-center justify-center mb-6">
                <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center">
                  <CheckCircleIcon className="h-12 w-12 text-green-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">Payment Approved!</h2>
              <p className="text-gray-600 mb-8 text-center">
                Great news! Your payment has been approved and your order is now being processed.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Order Details</h3>
                <p className="text-sm text-gray-600">Order Number: <span className="font-medium">{orderId}</span></p>
                <p className="text-sm text-gray-600">Date: <span className="font-medium">{new Date().toLocaleDateString()}</span></p>
                <p className="text-sm text-gray-600">Total: <span className="font-medium">Rs{finalTotal.toFixed(2)}</span></p>
                <p className="text-sm text-gray-600">Status: <span className="font-medium text-green-600">Approved</span></p>
              </div>
              <div className="text-center space-y-4">
                <button
                  onClick={generateInvoice}
                  className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors"
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download Invoice
                </button>
                <div>
                  <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center mb-6">
                <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center">
                  <CheckCircleIcon className="h-12 w-12 text-green-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">Order Completed!</h2>
              <p className="text-gray-600 mb-8 text-center">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Order Details</h3>
                <p className="text-sm text-gray-600">Order Number: <span className="font-medium">{orderId}</span></p>
                <p className="text-sm text-gray-600">Date: <span className="font-medium">{new Date().toLocaleDateString()}</span></p>
                <p className="text-sm text-gray-600">Total: <span className="font-medium">Rs{finalTotal.toFixed(2)}</span></p>
                <p className="text-sm text-gray-600">Status: <span className="font-medium text-green-600">Completed</span></p>
              </div>
              <div className="text-center space-y-4">
                <button
                  onClick={generateInvoice}
                  className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors"
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download Invoice
                </button>
                <div>
                  <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {/* Profile Data Notice */}
      {user && (user.name || user.address || user.phone) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
            <p className="text-sm text-blue-700">
              Your profile information has been automatically filled in. You can edit these details if needed.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Shipping Information */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <form onSubmit={handleContinueToPayment}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="123 Main St, City, Country"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="1234567890"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>
              {!showPaymentOptions && (
                <button
                  type="submit"
                  className="mt-6 w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
                >
                  Continue to Payment
                </button>
              )}
            </form>
          </div>

          {/* Payment Methods */}
          {showPaymentOptions && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              {errors.payment && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <div className="flex items-center">
                    <AlertCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-sm text-red-700">{errors.payment}</p>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                <div
                  className={`border rounded-md p-4 clickable hover:bg-gray-50 transition-colors ${
                    paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleSelectPaymentMethod('card')}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <CreditCardIcon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-gray-500">Pay securely with your card</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`border rounded-md p-4 clickable hover:bg-gray-50 transition-colors ${
                    paymentMethod === 'bank_slip' ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleSelectPaymentMethod('bank_slip')}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <Banknote className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Bank Slip</p>
                      <p className="text-sm text-gray-500">Pay via bank transfer</p>
                    </div>
                  </div>
                  {/* Bank slip upload area */}
                  {paymentMethod === 'bank_slip' && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-medium text-sm mb-2">Upload Payment Slip</h4>
                      <p className="text-xs text-gray-500 mb-3">
                        Please upload a screenshot or photo of your bank transfer receipt
                      </p>
                      {slipPreview ? (
                        <div className="mb-3">
                          <div className="relative w-full h-40 border rounded-md overflow-hidden">
                            <img
                              src={slipPreview}
                              alt="Payment slip preview"
                              className="w-full h-full object-contain"
                            />
                            <button
                              onClick={() => {
                                setSlipFile(null);
                                setSlipPreview(null);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{slipFile?.name}</p>
                        </div>
                      ) : (
                        <div
                          onClick={handleUploadClick}
                          className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center clickable hover:bg-gray-50 transition-colors ${
                            errors.slip ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        >
                          <UploadIcon className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-1">Click to upload</p>
                          <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                          />
                        </div>
                      )}
                      {errors.slip && <p className="text-red-500 text-sm mt-1">{errors.slip}</p>}
                    </div>
                  )}
                </div>

                <div
                  className={`border rounded-md p-4 clickable hover:bg-gray-50 transition-colors ${
                    paymentMethod === 'cash_on_delivery' ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleSelectPaymentMethod('cash_on_delivery')}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <TruckIcon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </div>
                  </div>
                  
                  {/* FIXED: Transport Options with Radio Behavior */}
                  {paymentMethod === 'cash_on_delivery' && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-medium text-sm mb-3">Select Delivery Area *</h4>
                      {errors.transport && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-3">
                          <div className="flex items-center">
                            <AlertCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                            <p className="text-sm text-red-700">{errors.transport}</p>
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* In Southern */}
                        <label
                          className={`border-2 rounded-md p-4 cursor-pointer transition-all block ${
                            transportOption === 'in_southern'
                              ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="transport"
                                value="in_southern"
                                checked={transportOption === 'in_southern'}
                                onChange={() => handleTransportOption('in_southern')}
                                className="sr-only"
                              />
                              <div>
                                <p className="font-medium">In Southern Province</p>
                                <p className="text-sm text-gray-500">Transport: Rs 500</p>
                              </div>
                            </div>
                            {transportOption === 'in_southern' && (
                              <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                        </label>

                        {/* Out of Southern */}
                        <label
                          className={`border-2 rounded-md p-4 cursor-pointer transition-all block ${
                            transportOption === 'out_southern'
                              ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="transport"
                                value="out_southern"
                                checked={transportOption === 'out_southern'}
                                onChange={() => handleTransportOption('out_southern')}
                                className="sr-only"
                              />
                              <div>
                                <p className="font-medium">Out of Southern Province</p>
                                <p className="text-sm text-gray-500">Transport: Rs 800</p>
                              </div>
                            </div>
                            {transportOption === 'out_southern' && (
                              <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleCompleteOrder}
                disabled={isProcessing}
                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Complete Order'}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="max-h-64 overflow-y-auto mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center py-2 border-b last:border-b-0">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mr-3" />
                  <div className="flex-grow">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">Rs{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>Rs{totalPrice.toFixed(2)}</span>
              </div>
              
              {/* Transport Fee - Show when transport option is selected */}
              {transportFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transport Fee</span>
                  <span>Rs{transportFee.toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>Rs{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;