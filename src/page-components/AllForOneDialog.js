import React from 'react';
import {Dialog, DialogContent} from "@mui/material";
import AddEditFmember from "./family-member/AddEditFmember";
import AddEditRequests from "./requests/AddEditRequests";
import RequestDetails from "./requests/RequestDetails";
import TransactionDetails from "./transactions/TransactionDetails";
import InvoiceDetails from "./invoices/InvoiceDetails";
import QueryDetails from "./support/QueryDetails";
import AddSubscription from "./subscription/AddSubscription";
import SubscriptionDetails from "./subscription/SubscriptionDetails";
import AddEditMenuCategory from "./menu-categories/AddEditMenuCategory";
import AddEditTable from "./tables/AddEditTable";
import AddEditMenuItem from "./menu-items/AddEditMenuItem";

const AllForOneDialog = ({open, setOpen, componentName, data, setData, each, index, setEach, setIndex, openDialog}) => {

    const selectAComonent = () => {
        switch (componentName) {
            case 'menu-category':
                return <AddEditMenuCategory
                    open={open}
                    setOpen={setOpen}
                    data={data}
                    setData={setData}
                    each={each}
                    index={index}
                    setEach={setEach}
                    setIndex={setIndex}
                />;
            case 'table':
                return <AddEditTable
                    open={open}
                    setOpen={setOpen}
                    data={data}
                    setData={setData}
                    each={each}
                    index={index}
                    setEach={setEach}
                    setIndex={setIndex}
                />;
            case 'menu-item' :
                return <AddEditMenuItem
                    open={open}
                    setOpen={setOpen}
                    data={data}
                    setData={setData}
                    each={each}
                    index={index}
                    setEach={setEach}
                    setIndex={setIndex}
                />
            case 'requests-details':
                return <RequestDetails
                    open={open}
                    setOpen={setOpen}
                    data={data}
                    setData={setData}
                    each={each}
                    index={index}
                    setEach={setEach}
                    setIndex={setIndex}
                />;
            case 'Transaction':
                return <TransactionDetails
                    open={open}
                    setOpen={setOpen}
                    data={data}
                    setData={setData}
                    each={each}
                    index={index}
                    setEach={setEach}
                    setIndex={setIndex}
                />;
            case 'invoice':
                return <InvoiceDetails
                    open={open}
                    setOpen={setOpen}
                    data={data}
                    setData={setData}
                    each={each}
                    index={index}
                    setEach={setEach}
                    setIndex={setIndex}
                />
            case 'support':
                return <QueryDetails
                    open={open}
                    setOpen={setOpen}
                    data={data}
                    setData={setData}
                    each={each}
                    index={index}
                    setEach={setEach}
                    setIndex={setIndex}
                    openDialog={openDialog}
                />
            case 'add-subscription':
                return <AddSubscription
                    open={open}
                    setOpen={setOpen}
                    data={data}
                    setData={setData}
                    each={each}
                    index={index}
                    setEach={setEach}
                    setIndex={setIndex}
                    openDialog={openDialog}
                />
            case 'subscription-details':
                return <SubscriptionDetails
                    open={open}
                    setOpen={setOpen}
                    data={data}
                    setData={setData}
                    each={each}
                    index={index}
                    setEach={setEach}
                    setIndex={setIndex}
                    openDialog={openDialog}
                />
        }
    };
    return (
        <>
            <Dialog onClose={() => {
                setOpen(false);
                if (setEach) setEach('');
                if (setIndex) setIndex('');
            }} open={open} maxWidth={'xs'} fullWidth>
                <DialogContent>
                    {selectAComonent()}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AllForOneDialog;