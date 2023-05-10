import * as React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {useRouter} from "next/router";
import {Avatar, Button, Menu, MenuItem, Typography} from "@mui/material";
import {authCookieName, cookieStorage} from "../apis/rest.app";
import Confirm from "./Confirm";
import {makeStyles} from "@mui/styles";
import {useUser} from "../store/UserContext";

const drawerWidth = 280;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const useStyles = makeStyles((theme) => ({
    image: {
        height: 18,
        width: 'auto',
        marginBottom: theme.spacing(0.5),
    },
    image2: {
        height: 26,
        width: 'auto',
    },
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function CustomDrawer({children}) {
    const classes = useStyles();
    const Router = useRouter();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [user, setUser] = useUser();
    const openMenu = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        Confirm('Are you sure?', 'Do you really want to logout ?', 'Yes, Sure')
            .then(() => {
                localStorage.removeItem(authCookieName);
                cookieStorage.removeItem(authCookieName);
                setUser(null);
                Router.push('/login');
            })
            .catch(() => {
            });
        handleClose();
    };
    const [open] = React.useState(true);
    const menuItemList = [
        {
            title: 'Dashboard',
            href: '/',
            icon: <img alt={'Dashboard'} src={'/images/icons/dashboard_unselected.svg'} className={classes.image}/>,
            selectedIcon: <img alt={'Dashboard'} src={'/images/icons/dashboard_selected.svg'}
                               className={classes.image}/>,
            // roles: [2,3]
        },
        {
            title: 'Orders',
            href: '/orders',
            icon: <img alt={'Order'} src={'/images/icons/orders_unselected.svg'} className={classes.image}/>,
            selectedIcon: <img alt={'Order'} src={'/images/icons/orders_selected.svg'}
                               className={classes.image}/>,
            // roles: [2,3]
        },
        {
            title: 'Menu Categories',
            href: '/menu-categories',
            icon: <img alt={'Dashboard'} src={'/images/icons/category_unselected.svg'} className={classes.image}/>,
            selectedIcon: <img alt={'Dashboard'} src={'/images/icons/category_selected.svg'}
                               className={classes.image}/>,
            // roles: [2,3]
        },
        {
            title: 'Menu Items',
            href: '/menu-items',
            icon: <img alt={'Dashboard'} src={'/images/icons/menu_items_unselected.svg'} className={classes.image}/>,
            selectedIcon: <img alt={'Dashboard'} src={'/images/icons/menu_items_selected.svg'} className={classes.image}/>,
            // roles: [2]
        },
        {
            title: 'Tables',
            href: '/tables',
            icon: <img alt={'Dashboard'} src={'/images/icons/table_unselected.svg'} className={classes.image}/>,
            selectedIcon: <img alt={'Dashboard'} src={'/images/icons/table_selected.svg'}
                               className={classes.image}/>,
            // roles: [2]
        },
        // {
        //     title: 'Service Log',
        //     href: '/transaction',
        //     icon: <img alt={'Dashboard'}  src={'/images/icons/transaction-unselected.svg'} className={classes.image}/>,
        //     selectedIcon: <img alt={'Dashboard'}  src={'/images/icons/transaction-selected.svg'} className={classes.image}/>,
        //     // roles: [2]
        // },{
        //     title: 'Invoices',
        //     href: '/invoices',
        //     icon: <img alt={'Dashboard'}  src={'/images/icons/invoice_inselected.svg'} className={classes.image}/>,
        //     selectedIcon: <img alt={'Dashboard'}  src={'/images/icons/invoice-selected.svg'} className={classes.image}/>,
        //     // roles: [2]
        // },{
        //     title: 'Support',
        //     href: '/support',
        //     icon: <img alt={'Dashboard'}  src={'/images/icons/support_unselected.svg'} className={classes.image}/>,
        //     selectedIcon: <img alt={'Dashboard'}  src={'/images/icons/support_selected.svg'} className={classes.image}/>,
        //     // roles: [2]
        // },
    ]

    return (
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            {/*<CssBaseline />*/}
            {/*<AppBar position="fixed">*/}
            <Toolbar sx={{backgroundColor: '#FAFAFA'}}>
                <Box sx={{ml: 35}}>
                    <Typography variant={'h6'}>
                        {menuItemList?.filter((e) => e?.href === Router.pathname)[0]?.title}
                    </Typography>
                </Box>
                {/*<img src={'/images/logo.svg'} style={{height: 35, width: 'auto'}} alt={'logo'}/>*/}
                <Box flexGrow={1}/>
                <Typography>
                    {user?.name}
                </Typography>
                <Button>
                    <Box display={'flex'}>
                        {
                            user ? <Avatar
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                sx={{bgcolor: 'secondary.main', color: 'white', cursor: 'pointer'}}
                                src={user?.avatar}
                            >
                                {user?.name.charAt(0)}
                            </Avatar> : ''
                        }

                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={openMenu}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Button>
            </Toolbar>
            {/*</AppBar>*/}
            <Drawer variant="permanent" open={open}>
                <DrawerHeader/>
                <Box sx={{display: 'flex'}} mt={-3} ml={3} mb={2}>
                    <img alt="Login Logo" style={{
                        width: '80%',
                        height: 'auto'
                    }} src={'/images/logo_long.svg'}/>
                </Box>
                <List sx={{p: 2}}>
                    {menuItemList
                        //     .filter(
                        //     each => user && each.roles.includes(user.role)
                        // )
                        .map((each, index) => (
                            <>
                                <ListItemButton
                                    key={each?.title}
                                    onClick={async () => {
                                        await Router.push(each.href);
                                    }}
                                    sx={Router.pathname === each.href ? {
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 1,
                                        backgroundColor: '#EBF4FF',
                                        borderRadius: 1,
                                        mt: 1.5
                                    } : {
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 1,
                                        mt: 1.5
                                    }}
                                >

                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mt: 0.5,
                                            mr: open ? 3 : 'auto',
                                            color: Router.pathname === each.href ? 'primary.main' : 'inherit',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {Router.pathname === each.href ? each.selectedIcon : each.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={each?.title} sx={{
                                        opacity: open ? 1 : 0,
                                        color: Router.pathname === each.href ? 'primary.main' : 'black'
                                    }}/>
                                </ListItemButton>
                            </>
                        ))}
                </List>
            </Drawer>
            <Box sx={{p: 3, backgroundColor: '#FAFAFA', width: '100%', height: '100vh', pl: {md: 38}}}>
                <DrawerHeader/>
                <Box>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
