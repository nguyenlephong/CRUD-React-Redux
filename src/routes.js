import React from 'react';
import CateListPage from 'pages/categoryManagement/CateListPage/CateListPage'
import ProductListPage from './pages/productManagement/ProductListPage/ProductListPage';
import ProductActionPage from './pages/productManagement/ProductActionPage/ProductActionPage';
import CateActionPage from 'pages/categoryManagement/CateActionPage/CateActionPage';
import CustomerActionPage from './pages/customerManagement/CustomerActionPage/CustomerActionPage';
import CustomerListPage from './pages/customerManagement/CustomerListPage/CustomerListPage';

const routes = [
    // {
    //     path: '/',
    //     exact: true,
    //     main: () => <HomePage />
    // },
    {
        path: '/cate-list',
        exact: false,
        main: () => <CateListPage />
    },
    {
        path: '/cate/add',
        exact: false, 
        main: ({ location, history }) => <CateActionPage location={location} history={history} />
    },
    {
        path: '/cate/:id/:pagination/edit',
        exact: false,
        main: ({ match, history }) => <CateActionPage match={match} history={history} />
    },
    {
        path: '/customer-list',
        exact: false,
        main: () => <CustomerListPage />
    },
    {
        path: '/customer/add',
        exact: false, 
        main: ({ location, history }) => <CustomerActionPage location={location} history={history} />
    },
    {
        path: '/customer/:id/:pagination/edit',
        exact: false,
        main: ({ match, history }) => <CustomerActionPage match={match} history={history} />
    },
    {
        path: '/product-list',
        exact: false,
        main: () => <ProductListPage />
    },
    {
        path: '/product/add',
        exact: false, 
        main: ({ location, history }) => <ProductActionPage location={location} history={history} />
    },
    {
        path: '/product/:id/:pagination/edit',
        exact: false,
        main: ({ match, history }) => <ProductActionPage match={match} history={history} />
    },
    // {
    //     path: '',
    //     exact: false,
    //     main: () => <NotFound />
    // }
];

export default routes;