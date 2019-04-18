import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';  
import Cookies from 'js-cookie';
import axios from 'axios';

function ProtectedRoute({ component: Component, path }) {
  const [loaded, setLoad] = useState(false);
  const [auth, setAuth] = useState(false);
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('/user/', { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} })

        if (result.status === 200) {
          setData(result.data);
          setAuth(true)
        }

        setLoad(true);
      } catch (err) {
        setLoad(true);
        console.error(err);
      }
    }
    fetchData();
  }, [])

  if (loaded) {
    if (auth) {
      return (<Component data={data[0]} location={path} /> )
    } else {
      return (<Redirect to="/login" />)
    }
  } else {
    return "Loading..."
  }
}

ProtectedRoute.propTypes = {
  component : PropTypes.func.isRequired,
  path      : PropTypes.string
}

export default ProtectedRoute;