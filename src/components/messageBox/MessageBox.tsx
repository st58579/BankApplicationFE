import React from "react";
import './MessageBox.css';
import {Button} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';

export type messageType = "error" | "info";

export interface MessageBoxProps {
    message : string,
    type : messageType,
    onClose : any
}

//komponenta reprezentující hlášku
const MessageBox = (props : MessageBoxProps) => {

    const classes : string[] =  ['messageBox'];

    if (props.type === 'error') {
        classes.push('errorMessage');
    }
    else {
        classes.push('infoMessage');
    }

    return (
        <div className={classes.join(' ')}>
            <div className='messageBody'>
                {props.message}
            </div>
            <div className='messageDismissButton'>
                <Button variant="contained" onClick={() => props.onClose()}>
                    <CloseIcon fontSize='small'/>
                </Button>
            </div>
        </div>
    );
};

export default MessageBox;