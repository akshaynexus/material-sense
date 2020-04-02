import React from 'react';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

export default class PoolsList extends React.Component{
    state = {
        loading:true,
        pooldata:null
    }
    async componentDidMount(){
        const APIPath = "http://mineit.io:4000/api/";
        const response = await fetch(APIPath + "pools");
        const data = await response.json();
        this.setState({pooldata: data.pools,loading:false});
    }
    tryial(){
        return <Button>AAA</Button>;
    }

    render(){
        return <div>
            {(this.state.loading|| !this.state.pooldata) ? <CircularProgress />:
            <div>
                {this.tryial()}
            </div>
        }
        </div>
    }
}