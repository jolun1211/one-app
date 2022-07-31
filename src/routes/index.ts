import Home from '../pages/home/index';
import List from '../pages/list/index';
import React, { Component } from 'react';
const routers = [
    {
        path: "/",
        component:  Home,
        title:"首页",
        childRoutes: []
    },
    {
        path: "/list",
        component: List,
        title:"列表",
        childRoutes: []
    },
]

export default routers;