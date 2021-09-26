import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { get } from 'http';
import { debuggerStatement } from '@babel/types';

const StarWars = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canLoading, setCanLoading] = useState(true);
  const [peopleInfo, setPeopleInfo] = useState({});
  const [canShowPeopleInfo, setCanShowPeopleInfo] = useState(false);
  const [notFound, setNotFound] = useState(false);
  var endCursor;
  var isFindAll = false;
  useEffect(() => {
    setTimeout(RequestApi, 1000);
    document.getElementsByClassName('people-list')[0].addEventListener('scroll', handleOnScroll);
    return () => {
      document.getElementsByClassName('people-list')[0].removeEventListener('scroll', handleOnScroll);
    }
  }, [])

  const handleOnScroll = () => {
    if(!isFindAll) {
      if(Math.abs(document.getElementsByClassName('people-list')[0].scrollTop - (people.length * 70 - document.getElementsByClassName('people-list')[0].offsetHeight)) < 1 && canLoading) {
        setCanLoading(false);
        setLoading(true);
        setTimeout(RequestApi, 1000);
      }
    }    
  }
  const showPeopleInfo = (index) => {
    setCanShowPeopleInfo(true);
    setPeopleInfo(people[index]);
  }
  const RequestApi = async() => {
    const query = `
      query GetAllData {
        allPeople (first: 5${endCursor?', after: "'+endCursor+'"': ""}){
          edges {
            cursor
            node {
              id
              name
              gender
              birthYear
              eyeColor
              hairColor
              height
              mass
              skinColor
              created
              edited
            }
          }
        }
      }    
    `
    axios.post(`https://swapi-graphql.netlify.app/.netlify/functions/index`, {
      query: query
    })
    .then(response=>response.data.data.allPeople.edges)
    .then(edges => {
      if(!edges.length && !people.length) {
        setNotFound(true);
        setLoading(false);
      }
      else {
        setCanLoading(true);
        var showPeople = people;
        console.log('asda0', edges.length);
        if(edges.length < 5) {
          isFindAll = true;
          setLoading(false);
          return;
        }
        edges.map((item) => {
          showPeople.push(item.node);
        })
        endCursor = edges[edges.length-1].cursor;
        setPeople(showPeople);
        setLoading(false);        
        if(!document.getElementsByClassName('people-list')[0].scrollTop) {
          if(showPeople.length * 70 + 52 < window.innerHeight) {
            setLoading(true);
            setTimeout(RequestApi, 1000);
          }
        }        
      }       
    })    
  }

  return(
    <div className='container-fluid'>
      <div className='header'>
        <h4>Ravn Star Wars Registry</h4>
      </div>
      <div className='row'>
        <div className='people-list col-lg-3 col-md-4 col-sm-6'>
        {
          notFound?
          <div className='not-found'>Failed to Load Data</div>
          :
          people.map((one, index) => {
            return <p onClick={()=>{showPeopleInfo(index)}}>{one.name}<i className='icon-angle-right'></i></p>
          })
        }
        {
          loading&&!isFindAll?
          <div><i className='icon-refresh icon-spin'></i></div>
          :
          false
        }
        </div>
        <div className='people-info col-lg-9 col-md-8 col-sm-6'>
        {
          canShowPeopleInfo?
          <div className='container'>
            <div className='general-information'>
              <h3>General Information</h3>
              <div className='people-info-field'>
                <span>Eye Color</span>
                <span className='field-info'>{peopleInfo.eyeColor}</span>
              </div>
              <div className='people-info-field'>
                <span>Hair Color</span>
                <span className='field-info'>{peopleInfo.hairColor}</span>
              </div>
              <div className='people-info-field'>
                <span>Skin Color</span>
                <span className='field-info'>{peopleInfo.skinColor}</span>
              </div>
              <div className='people-info-field'>
                <span>Birth Year</span>
                <span className='field-info'>{peopleInfo.birthYear}</span>
              </div>     
            </div> 
            <div className='vehicles'>
              <h3>Vehicles</h3>
              <div className='people-info-field'>
                <span>Snowspeeder</span>
              </div>
              <div className='people-info-field'>
                <span>Imperial Speeder Bike</span>
              </div>   
            </div>       
          </div>
          :
          false
        }
        </div>
      </div>
      
    </div>
  )
}

export default StarWars