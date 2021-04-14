import React, { useEffect, useState, useCallback } from 'react';
import { getReposGitHub } from '../utils/fetchTogitHub';
import '../styles/Timeline.css';
import CircularProgress from '@material-ui/core/CircularProgress';

const Timeline = () => {
  const [repos, setRepos] = useState([]);
  const [title, setTitle] = useState('');
  const [errorSearch, setErrorSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputHandler = useCallback((event) => {
    setTitle(event.target.value);
  }, [title]);

  const searchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getReposGitHub(title);
      setRepos(res.data);
      setErrorSearch(false);
      setIsLoading(false);
    } catch (err) {
      setErrorSearch(true);
    }
  }, [title, repos]);

  const submitHandler = useCallback(() => {
    searchUser();
    setTitle('');
  }, [title]);

  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0
          && rect.left >= 0
          && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
          && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function callbackFunc() {
    const items = document.querySelectorAll('.timeline li');
    for (let i = 0; i < items.length; i++) {
      if (isElementInViewport(items[i])) {
        items[i].classList.add('in-view');
      }
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', callbackFunc);
      window.addEventListener('resize', callbackFunc);
      window.addEventListener('scroll', callbackFunc);
    } else {
      return null;
    }
  }, []);
  return (
    <div>
      <section className="intro">
        <div className="container">
          {isLoading ? <CircularProgress /> : <h1>Vertical Timeline &darr;</h1> }
        </div>
        <div>
          <form className="container">
            <input type="text" value={title} onChange={inputHandler} />
            <input type="button" className="btn" value="search" onClick={submitHandler} />
          </form>
          <span className="errorHandler">{errorSearch ? 'no such user was found' : null}</span>
        </div>
      </section>
      <section className="timeline">
        <ul>
          {repos.map((repo) => (
            <div className="listLi" key={repo.id}>
              <li>
                <div>
                  <time className="repoName">{repo.name}</time>
                </div>
              </li>
            </div>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Timeline;
