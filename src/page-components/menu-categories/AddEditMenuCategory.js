import React, {useEffect, useState} from "react";
import {Box, Button, CircularProgress, TextField, Typography} from "@mui/material";
import {MenuCategoryService} from "../../apis/rest.app";
import {useSnackbar} from "notistack";


const AddEditMenuCategory = ({each, index, setOpen, setData, data, openDialog}) => {
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const [feePercentage, setFeePercentage] = useState('');

    useEffect(() => {
        if (each) {
            setType(each?.name);
            setDescription(each?.description);
            setFeePercentage(each?.feePercentage);
        }
    }, [each]);

    const handleSubmit = async () => {
        if (each) {
            setLoading(true);
            await MenuCategoryService.patch(each?.id, {
                "name": type,
                "description": description,
                "avatar": "",
            })
                .then(async (res) => {
                    setData(([...datum]) => {
                        datum[index] = res;
                        return datum;
                    });
                    setOpen(false);
                    setLoading(false);
                }).catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something went wrong', {variant: 'error'});
                    setLoading(false);
                });
        } else {
            setLoading(true);
            await MenuCategoryService.create({
                "name": type,
                "description": description,
                "avatar": "",
            })
                .then(async (res) => {
                    setLoading(false);
                    setData([res, ...data]);
                    enqueueSnackbar('Menu category added successfully', {variant: 'success'});
                    setOpen(false);
                }).catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something went wrong', {variant: 'error'});
                    setLoading(false);
                });
        }
    };

    return (
        <>
            <Box display={'flex'} justifyContent={'space-between'} width={'100%'} mb={2}>
                <Typography sx={{fontWeight: 600}}>
                    {each ? 'Edit Menu Category' : 'Add Menu Category'}
                </Typography>
                <img src={'/images/icons/cross_icon.svg'} alt={'Image'} style={{cursor: 'pointer'}}
                     onClick={()=> setOpen(false)}/>
            </Box>
            <Box display={'flex'} flexDirection={'column'} width={'100%'}>
                <Typography>
                    {'Title'}
                </Typography>
                <TextField
                    size={'small'}
                    color={'primary'}
                    fullWidth
                    onChange={(event) => setType(event.target.value)}
                    value={type}
                    variant="outlined"
                />
            </Box>
            <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={1.5}>
                <Typography sx={{mb: 0.5}}>
                    {'Description'}
                </Typography>
                <TextField
                    size={'small'}
                    color={'primary'}
                    fullWidth
                    onChange={(event) => setDescription(event.target.value)}
                    value={description}
                    variant="outlined"
                    multiline
                    rows={4}
                />
            </Box>
            {/*<Box display={'flex'} flexDirection={'column'} width={'100%'} mt={1.5}>*/}
            {/*    <Typography sx={{mb: 0.5}}>*/}
            {/*        {'Fee Percentage'}*/}
            {/*    </Typography>*/}
            {/*    <TextField*/}
            {/*        size={'small'}*/}
            {/*        color={'primary'}*/}
            {/*        fullWidth*/}
            {/*        onChange={(event) => {*/}
            {/*            setFeePercentage(event.target.value);*/}
            {/*        }}*/}
            {/*        value={feePercentage}*/}
            {/*        variant="outlined"*/}
            {/*    />*/}
            {/*</Box>*/}
            <Box alignItems={'center'} display={'flex'} justifyContent={'space-between'} mt={4} width={'100%'}>
                <Button
                    fullWidth
                    color="primary"
                    disabled={loading || type === '' || description === ''}
                    variant={'contained'}
                    onClick={handleSubmit}
                >
                    {loading ? <CircularProgress size={24}/> : each ? 'SAVE CHANGES' : 'ADD'}
                </Button>
            </Box>
        </>
    );
};

export default AddEditMenuCategory;


//
// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment } from "react";
// import { useRouter } from "next/router";
//
//
// export default function CategoryDialog({ open, setOpen }) {
//     const [otp, setOtp] = useState("");
//
//     const router = useRouter();
//
//     const closeModal = () => {
//         setOpen(false);
//     };
//
//     return (
//         <Transition appear show={open} as={Fragment}>
//             <Dialog as="div" className="relative z-10" onClose={closeModal}>
//                 <Transition.Child
//                     as={Fragment}
//                     enter="ease-out duration-300"
//                     enterFrom="opacity-0"
//                     enterTo="opacity-100"
//                     leave="ease-in duration-200"
//                     leaveFrom="opacity-100"
//                     leaveTo="opacity-0"
//                 >
//                     <div className="fixed inset-0 bg-black bg-opacity-80" />
//                 </Transition.Child>
//
//                 <div className="fixed inset-0 overflow-y-auto">
//                     <div className="flex min-h-full items-center justify-center p-4 text-center">
//                         <Transition.Child
//                             as={Fragment}
//                             enter="ease-out duration-300"
//                             enterFrom="opacity-0 scale-95"
//                             enterTo="opacity-100 scale-100"
//                             leave="ease-in duration-200"
//                             leaveFrom="opacity-100 scale-100"
//                             leaveTo="opacity-0 scale-95"
//                         >
//                             <Dialog.Panel className="w-full max-w-sm text-center transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
//                                 <div className="mt-2">
//                                     <div className="w-full max-w-xs">
//                                         {" "}
//                                         <div className="bg-white p-10 rounded-md">
//                                             <div className="my-2">
//                                                 <div className="relative mt-2 rounded-md shadow-sm">
//                                                     <input
//                                                         type="text"
//                                                         placeholder="Name"
//                                                         name="price"
//                                                         id="price"
//                                                         className="block w-full rounded-md border-0 py-1.5 px-2  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
//                                                     />
//                                                 </div>
//                                             </div>
//
//                                             <div className="my-2">
//                                                 <div className="relative mt-2 rounded-md shadow-sm">
//                                                     <input
//                                                         type="text"
//                                                         name="price"
//                                                         id="price"
//                                                         placeholder="Description"
//                                                         className="block w-full rounded-md border-0 py-1.5 px-2  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
//                                                     />
//                                                 </div>
//                                             </div>
//                                             <div className="rounded-md border my-5 w-10">
//                                                 {" "}
//                                                 <button>+</button>
//                                             </div>
//
//                                             <div onClick={() => setOpen(true)} className="py-6">
//                                                 <PrimaryButton text={"Add"} color={"bg-[#575AE5]"} />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </Dialog.Panel>
//                         </Transition.Child>
//                     </div>
//                 </div>
//             </Dialog>
//         </Transition>
//     );
// }
//
//
// function classNames(...classes) {
//     return classes.filter(Boolean).join(" ");
// }
//
// const PrimaryButton = ({ text, color }) => {
//     return (
//         <button
//             className={classNames(
//                 color,
//                 "rounded-md text-white w-full py-2 bg-[#E61323] hover:bg-[#E61323]-800"
//             )}
//         >
//             {text}
//         </button>
//     );
// };
//
