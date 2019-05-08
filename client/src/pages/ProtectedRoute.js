import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Header from '../components/Header';
import Loading from '../components/Loading';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import axios from 'axios';

function ProtectedRoute({ component: Component, path, match }) {
  const [loaded, setLoad] = useState(false);
  const [auth, setAuth] = useState(false);
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('/user/', { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} });
        if (result.status === 200) {
          if (result.data[0].spotifyAuth){
            if (!(result.data[0].listeningData) || (result.data[0].listeningData)){
              try {
                const result = await axios.get('/user/listening-data', { headers: {'Authorization' : 'Bearer ' + Cookies.get('cookie')} });
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
            else{
              setData(result.data);
              setAuth(true)
            }
          }
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
      return (<Component data={data[0]} location={path} profileName={match.params.username} /> )
    } else {
      return (<Redirect to="/login" />)
    }
  } else {
    return (<>
      <Header name={""} location={path} />
      <br />
      <br />
      <Loading loading />
    </>)
  }
}

ProtectedRoute.propTypes = {
  component : PropTypes.func.isRequired,
  path      : PropTypes.string
}

export default ProtectedRoute;
