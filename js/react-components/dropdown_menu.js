class DropdownMenu extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      showMenu: false,
    };
    
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.dropdownMenu = React.createRef();
  }
  
  showMenu(event) {
    event.preventDefault();
    
    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }
  
  closeMenu(event) {
    
    if (!this.dropdownMenu.current.contains(event.target)) {
      
      this.setState({ showMenu: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });  
      
    }
  }
  
  render() {
    const menu = (
      this.state.showMenu ? (
        React.createElement('div', {
          className: 'menu mpc6lx-0 dMZkik',
          ref: this.dropdownMenu 
        }, this.props.menu_contents)
      )
      : (
        null
      )
    );
    return React.createElement('div', null, [
        React.createElement('div', {
          onClick: this.showMenu
        }, this.props.button),
        menu
      ]
    );
  }
}
