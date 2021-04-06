import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import PropTypes from 'prop-types';

export const Modal = ({isOpen, handleClose, title, subTitle, children, handleAction, actionTitle}) => {
    return (
       <>
           <Dialog fullWidth maxWidth={"md"} open={isOpen} onClose={handleClose} aria-labelledby="max-with-dialog-title">
               <DialogTitle id="max-with-dialog-title">{title}</DialogTitle>
               <DialogContentText>{subTitle}</DialogContentText>
               <DialogContent>{children}</DialogContent>
               <DialogActions>
                   <Button onClick={handleClose} color="primary">Close</Button>
                   {handleAction && actionTitle && <Button onClick={handleAction} color="primary">{actionTitle}</Button>}
               </DialogActions>
           </Dialog>
       </>
    );
}
Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    children: PropTypes.element.isRequired,
    handleAction: PropTypes.func,
    actionTitle: PropTypes.string.isRequired,

}