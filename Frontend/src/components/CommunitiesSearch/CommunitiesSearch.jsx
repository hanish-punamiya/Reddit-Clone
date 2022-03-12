import React from 'react';
import {
  Paper,
  List,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import axios from 'axios';

import CommunitiyTile from './CommunityTile';

import { serverURL, imageBucket } from '../../utils/config';
import '../../styles/CommunitiesSearch/CommunitiesSearch.css';

class CommunitiesSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comsPerPage: 2,
      numberOfPages: 0,
      currentPage: 1,
      currentPageList: [],
      sortOption: 'date desc',
      communityList: [],
      searchParams: '',
    };
  }

  componentDidMount() {
    this.getCommunityList('');
  };

  getCommunityList = (param) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `${token}` },
    }
    axios.get(`${serverURL}/api/community-search/${param}`, config)
      .then((res) => {
        const { comsPerPage, sortOption } = this.state;
        this.setState({ communityList: res.data }, () => {
          this.changePage(1);
          this.updateComsPerPage(comsPerPage);
          const updateOption = { target: { value: sortOption } };
          this.updateSort(updateOption);
        });
      });
  }
  
  updateComsPerPage = (comsPerPage) => {
    const { communityList } = this.state;
    const numberOfPages = Math.ceil(communityList.length / comsPerPage);
    this.setState({ comsPerPage, numberOfPages });
    this.changePage(1, comsPerPage);
  }

  callUpdateComsPerPage = (e, value) => {
    const comsPerPage = value.props.value;
    this.updateComsPerPage(comsPerPage);
  }

  changePage = (currentPage, perPage = null) => {
    const { communityList } = this.state;
    let itemsPerPage = null;
    if (perPage === null) {
      itemsPerPage = this.state.comsPerPage;
    } else {
      itemsPerPage = perPage;
    }
    const start = (currentPage - 1) * itemsPerPage;
    const end = (currentPage * itemsPerPage);
    const currentPageList = communityList.slice(start, end);
    this.setState({ currentPage, currentPageList })
  }

  callChangePage = (e, value) => {
    this.changePage(value);
  }

  updateSearchParams = (e) => {
    this.setState({ searchParams: e.target.value });
  }

  updateSort = (e) => {
    const sortOption = e.target.value;
    const { communityList } = this.state;
    switch(sortOption) {
      case 'votes asc':
        communityList.sort((a, b) => a.votes - b.votes);
        break;
      case 'votes desc':
        communityList.sort((a, b) => b.votes - a.votes);
        break;
      case 'users asc':
        communityList.sort((a, b) => a.users - b.users);
        break;
      case 'users desc':
        communityList.sort((a, b) => b.users - a.users);
        break;
      case 'date asc':
        communityList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'date desc':
        communityList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        communityList.reverse();
        break;
      case 'least posts':
        communityList.sort((a, b) => a.postsCount - b.postsCount);
        break;
      case 'most posts':
        communityList.sort((a, b) => b.postsCount - a.postsCount);
        break;
      case 'least pop posts':
        communityList.sort((a, b) => a.postUpvotes - b.postUpvotes);
        break;
      case 'most pop posts':
        communityList.sort((a, b) => b.postUpvotes - a.postUpvotes);
        break;
      default:
        break;
    }
    this.setState({ sortOption, communityList });
    this.changePage(1);
  }

  render() {
    const {
      comsPerPage,
      numberOfPages,
      currentPage,
      currentPageList,
      sortOption,
      searchParams,
    } = this.state;
    return (
      <section id="community-search-page">
        <Paper id="options-bar">
          <Select
            label="Items"
            value={comsPerPage}
            onChange={this.callUpdateComsPerPage}
          >
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
          </Select>
          <Select
            value={sortOption}
            onChange={this.updateSort}
          >
            <MenuItem value={"votes desc"}>Highest Voted</MenuItem>
            <MenuItem value={"votes asc"}>Lowest Voted</MenuItem>
            <MenuItem value={"users asc"}>Least Users</MenuItem>
            <MenuItem value={"users desc"}>Most Users</MenuItem>
            <MenuItem value={"date desc"}>Newest</MenuItem>
            <MenuItem value={"date asc"}>Oldest</MenuItem>
            <MenuItem value={"most posts"}>Most Posts</MenuItem>
            <MenuItem value={"least posts"}>Least Posts</MenuItem>
            <MenuItem value={"most pop posts"}>Most Popular Posts</MenuItem>
            <MenuItem value={"least pop posts"}>Least Popular Posts</MenuItem>
          </Select>
          <div>
            <TextField
              placeholder="Search..."
              value={searchParams}
              onChange={this.updateSearchParams}
            />
            <Button onClick={() => this.getCommunityList(searchParams)}>
              Search
            </Button>
          </div>
        </Paper>
        <List id="communities-list">
          {currentPageList.map((community) => (
            <CommunitiyTile
              title={community.title}
              description={community.description}
              image={`${imageBucket}${community.image[0]}`}
              id={community.id}
              key={community.id}
              votes={community.votes}
              users={community.users}
              date={community.date}
              postsCount={community.postsCount}
              postUpvotes={community.postUpvotes}
            />
          ))}
        </List>
        <Paper id="communities-pagination">
          <Pagination     
            count={numberOfPages}
            page={currentPage}
            onChange={this.callChangePage}
          />
        </Paper>
      </section>
    );
  }
}

export default CommunitiesSearch;