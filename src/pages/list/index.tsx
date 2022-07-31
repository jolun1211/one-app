import { inject, observer } from 'mobx-react';
import React, { useState, useEffect } from 'react';
import { CommonBusiness, ICommonBusinessProps } from '../../business/commonBusiness';

const List = inject(CommonBusiness)(
    observer((props: IproposalProps) => {
        console.log("props", props)
        const { selfName, test } = props;
        const [name,setName] =useState("")
        useEffect(() => {
            test().then((res)=>{
                setName(res?.data[0]?.name)
            });
        }, [])

        return (
            <div>{name}页面</div>
        );
    }))

export default List;

interface IproposalProps extends ICommonBusinessProps {

}


