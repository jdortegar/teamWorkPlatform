import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap/lib';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';
import { FieldGroup } from '../../../components';
import { Form, Button } from 'react-bootstrap/lib';
import { user, teams } from '../../../actions/index';

class HeaderNavbar extends Component {

    static contextTypes = {
        router: PropTypes.object
    };
    constructor(props) {
        super(props);
    }

    chooseTeam(team) {
        this.props.teamrooms(team);
        this.props.teammembers(team);
        this.context.router.push('/teamroom');
    }
    
    render() {
        
    	return (
    		<Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        {/* <a href="index.html"><img className="logo" src='/resources/img/logo.png' /> */}
                            <Link to="/"><img className="logo" src='https://c2.staticflickr.com/4/3955/33078312014_f6f8c759db_o.png' />
                        </Link>
                        <span className="logo-habla">Habla AI</span>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>

                <Navbar.Collapse>
                    <Nav pullRight>
                        <LinkContainer to="/product">
                            <NavItem eventKey={1} >Product</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/pricing">
                            <NavItem eventKey={2} >Pricing</NavItem>
                        </LinkContainer>
                
                        {   
                            this.props.user != null ? (

                            <NavDropdown eventKey={this.props.teams.length} title="Your Teams" id="basic-nav-dropdown">
                            {
                                this.props.teams.map((team, i) => {
                                    return (
                                       
                                        <MenuItem className="home-yourteam-item" eventKey={3.1} key={i} >{team.name}</MenuItem>
                                    );
                                })
                                
                            }
                                
                            </NavDropdown>
                            ):( 
                            <LinkContainer to="/signin">
                                <NavItem eventKey={4} >Login</NavItem>
                            </LinkContainer>)
                        }


                        <LinkContainer to="/register">
                            <NavItem eventKey={5} >Register</NavItem>
                        </LinkContainer>
                      
                           
                     
                    </Nav>

                </Navbar.Collapse>
                
            </Navbar>
    	);
    }
}

function mapStateToProps(state) {
        return {
            user: state.user.user,
            teams: state.teams.teams
        };
}
export default connect(mapStateToProps, )(HeaderNavbar);

// <Link to="/team/teamroom" className="blue-link">{team.name}</Link>
