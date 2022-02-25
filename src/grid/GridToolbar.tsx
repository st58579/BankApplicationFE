import React from "react";
import {alpha, AppBar, Button, InputBase, makeStyles, Menu, MenuItem, Toolbar, Typography} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import {ExportType} from "../gridomizer/domain/GridData";
import {GridToolbarElementProps} from "../gridomizer/gridtoolbar/Types";

interface Props extends GridToolbarElementProps {
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: "auto",
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const GridToolbar: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const [searchTerm, setSearchTerm] = React.useState<string | undefined>(undefined);
    const [anchorElExport, setAnchorElExport] = React.useState<null | HTMLElement>(null);

    const onOpenExportMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElExport(event.currentTarget);
    };

    const onCloseExportMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElExport(null);
    };
    const onExportClick = (exportType: ExportType) => {
        setAnchorElExport(null);
        if (props.onExport) {
            props.onExport(exportType);
        }
    };

    const renderExportButton = () => {
        let label = "EXPORT"
        if (props.selectedRowsCount > 0) {
            label = "EXPORT (" + props.selectedRowsCount + ")"
        }
        return (<div>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={onOpenExportMenu} color="inherit"
                    style={{marginLeft: "10px"}}>
                {label}
            </Button>
            <Menu id="simple-menu"
                  anchorEl={anchorElExport}
                  keepMounted
                  open={Boolean(anchorElExport)}
                  onClose={onCloseExportMenu}
                  getContentAnchorEl={null}
                  anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                  transformOrigin={{vertical: "top", horizontal: "center"}}>

                <MenuItem onClick={e => onExportClick(ExportType.CSV)}>CSV</MenuItem>
                <MenuItem onClick={e => onExportClick(ExportType.XLS)}>EXCEL</MenuItem>
                <MenuItem onClick={e => onExportClick(ExportType.DASH)}>Tigra :)</MenuItem>
            </Menu>
        </div>)
    }

    const onSearchInput = (e :React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }

    const onSearchByEnter = ( e : React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (e.key === 'Enter') {
            props.onSearch(props.columns, searchTerm, searchTerm);
        }
    }

    const onSearch = () => {
        props.onSearch(props.columns, searchTerm, searchTerm);
    }

    const renderSearchField = () => {
        return (
            <div className={classes.search} style={{marginLeft: "auto"}}>
                <div className={classes.searchIcon}>
                    <SearchIcon onClick={onSearch} style={{cursor : "pointer"}}/>
                </div>
                <InputBase
                    placeholder="Search…"
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{'aria-label': 'search'}}
                    onChange={onSearchInput}
                    onKeyDown={onSearchByEnter}
                />
            </div>)
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">
                        {props.label}
                    </Typography>
                    {/*{renderExportButton()}*/}
                    {/*{renderSearchField()}*/}
                </Toolbar>
            </AppBar>
        </div>

    )

}

export default GridToolbar