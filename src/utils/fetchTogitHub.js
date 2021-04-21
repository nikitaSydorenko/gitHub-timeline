import axios from 'axios';

export const getReposGitHub = (username) => axios.get(`https://api.github.com/users/${username}/repos`);
