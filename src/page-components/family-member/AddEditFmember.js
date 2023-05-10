import React, {useEffect, useState} from "react";
import {
    Avatar, Badge,
    Box,
    Button,
    FormControl,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import { useCropperDialog, withCropper } from "../../components/Crop/CropperDialogProvider";
import {FamilyMemberService, RelationService, uploadFile} from "../../apis/rest.app";
import {useSnackbar} from "notistack";

const AddEditFmember = ({each,open,setOpen,setData,data,index,setEach,setIndex}) =>{
    const { getCroppedImage } = useCropperDialog();
    const [src, setSrc] = useState('');
    const [image, setImage] = useState('');
    const [relations, setRelations] = useState([]);
    const [loading,setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [values,setValues] = useState({
        "name": "",
        "phone": "",
        "relationType": 'All',
        "addressLine1": "",
        "city": "",
        "state": "",
        "pinCode": ""
    });

    useEffect(() =>{
        if (each){
            setValues({
                name: each?.name,
                "phone": each?.phone,
                "relationType": each?.relationType,
                "addressLine1": each?.address?.addressLine1,
                "city": each?.address?.city,
                "state": each?.address?.state,
                "pinCode": each?.address?.pinCode
            });
            setSrc(each?.avatar);
            setImage(each?.avatar);
        }
    },[each]);

    const handlePickImage = async () => {
        getCroppedImage({
            aspectRatio: 1,
        }).then((res) => {
            if (res.status === 'CROPPED') {
                setSrc(res.src);
            }
        });
    };

    useEffect(() =>{
        RelationService.find({query:{
            $limit:-1
            }}).then((res) =>{
                setRelations([...res])
        }).catch((error) =>{
            enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
        });
    },[]);

    const dataURLtoFile = (dataurl, filename) => {
        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    console.log(each);

    const handleSubmit = async () => {
        // if (validate()){
        let _image = src;
        if (image === '') {
            await uploadFile(dataURLtoFile(src, `file-name-1.png`)).then((res) => {
                _image = res[0].filePath
            }).catch((error) => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });

            })
        }
        if (each) {
            setLoading(true);
            await FamilyMemberService.patch(each?.id, {
                "name": values?.name,
                "phone": values?.phone,
                "avatar": _image,
                "relationType": values?.relationType,
                "address": {
                    "addressLine1": values?.addressLine1,
                    "city": values?.city,
                    "state": values?.state,
                    "pinCode": values?.pinCode
                }
            },{query:{ $eager:'[relation]'}})
                .then(async (res) => {
                    setData(([...datum]) =>{
                        datum[index] = res;
                        return datum;
                    });
                    setOpen(false);
                    setLoading(false);
                }).catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
                    setLoading(false);
                });
        } else {
            setLoading(true);
            await FamilyMemberService.create({
                "name": values?.name,
                "phone": values?.phone,
                "avatar": _image,
                "relationType": values?.relationType,
                "address": {
                    "addressLine1": values?.addressLine1,
                    "city": values?.city,
                    "state": values?.state,
                    "pinCode": values?.pinCode
                }
            },{query:{ $eager:'[relation]'}})
                .then(async (res) => {
                    setLoading(false);
                    setData([res,...data]);
                    enqueueSnackbar('Family member added successfully', { variant: 'success' });
                    setOpen(false);
                }).catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
                    setLoading(false);
                });
        }
    };

    return(
      <>
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
              <Box display={'flex'} justifyContent={'space-between'} width={'100%'} mb={2}>
                  <Typography fontWeight={600}>
                      {each?'Edit family member details':'Add new family member'}
                  </Typography>
                  <img src={'/images/icons/cross_icon.svg'} alt={'Image'} style={{cursor:'pointer'}} onClick={() =>{setOpen(false);setEach('');setIndex('')}}/>
              </Box>
              {
                  src?
                      <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                              <img
                                  alt="Remy Sharp"
                                  src={'/images/icons/black_edit_icon.svg'}
                                  style={{cursor:'pointer'}}
                                  onClick={async () => {
                                      await handlePickImage();
                                      // setSrc('');
                                      setImage('');
                                  }}
                              />
                          }
                      >
                          <Avatar alt="Travis Howard" src={src} sx={{height:'110px',width:'110px'}} />
                      </Badge>
                      :
                      <Box sx={{
                          height: "100px",
                          width: "100px",
                          backgroundColor: "#E6F4FF",
                          borderRadius: "50%",
                          padding: "10px",
                          display:'flex',
                          alignItems:'center',
                          justifyContent:'center',
                          cursor: "pointer"
                      }} onClick={async () => {
                          await handlePickImage();
                          // setSrc('');
                          setImage('');
                      }}>
                          <img src={'/images/demo-image-icon.svg'} alt="image" height={45} width={45} />
                      </Box>
              }

              <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={1}>
                  <Typography>
                      {'Name'}
                  </Typography>
                  <TextField
                      autoComplete={'off'}
                      size={'small'}
                      autoFocus
                      color="primary"
                      fullWidth
                      variant="outlined"
                      value={values?.name}
                      onChange={(e)=>{setValues({...values,name:e.target.value});}}
                  />
              </Box><Box display={'flex'} flexDirection={'column'} width={'100%'} mt={1}>
              <Typography>
                  {'Relation'}
              </Typography>
              <FormControl sx={{mt:1}}>
                  <Select
                      size={'small'}
                      value={values?.relationType}
                      onChange={(e) =>{setValues({...values,relationType: e?.target.value});}}
                  >
                      <MenuItem value={'All'}>
                          {'Select a Type'}
                      </MenuItem>
                      {relations.map((e) => (
                          <MenuItem key={e?.id} value={e?.id}>
                              {e?.relationType}
                          </MenuItem>
                      ))}
                  </Select>
              </FormControl>
          </Box><Box display={'flex'} flexDirection={'column'} width={'100%'}mt={1}>
              <Typography>
                  {'Phone Number'}
              </Typography>
              <TextField
                  autoComplete={'off'}
                  size={'small'}
                  color="primary"
                  fullWidth
                  variant="outlined"
                  value={values?.phone}
                  type={'number'}
                  onChange={(e)=>{
                      if (e?.target?.value?.length <= 10){
                          setValues({...values,phone:e.target.value});
                      }
                  }}
              />
          </Box><Box display={'flex'} flexDirection={'column'} width={'100%'} mt={1}>
              <Typography>
                  {'State'}
              </Typography>
              <TextField
                  autoComplete={'off'}
                  size={'small'}
                  color="primary"
                  fullWidth
                  variant="outlined"
                  value={values?.state}
                  onChange={(e)=>{setValues({...values,state:e.target.value});}}
              />
          </Box><Box display={'flex'} flexDirection={'column'} width={'100%'} mt={1}>
              <Typography>
                  {'City'}
              </Typography>
              <TextField
                  autoComplete={'off'}
                  size={'small'}
                  color="primary"
                  fullWidth
                  variant="outlined"
                  value={values?.city}
                  onChange={(e)=>{setValues({...values,city:e.target.value});}}
              />
          </Box><Box display={'flex'} flexDirection={'column'} width={'100%'} mt={1}>
              <Typography>
                  {'Flat, building, or apartment'}
              </Typography>
              <TextField
                  autoComplete={'off'}
                  size={'small'}
                  color="primary"
                  fullWidth
                  variant="outlined"
                  value={values?.addressLine1}
                  onChange={(e)=>{setValues({...values,addressLine1:e.target.value});}}
              />
          </Box>
              <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={1}>
              <Typography>
                  {'Pin code'}
              </Typography>
              <TextField
                  autoComplete={'off'}
                  size={'small'}
                  color="primary"
                  fullWidth
                  type={'number'}
                  variant="outlined"
                  value={values?.pinCode}
                  onChange={(e)=>{
                      if (e?.target?.value?.length <= 6){
                          setValues({...values,pinCode:e.target.value});
                      }
                  }}
              />
          </Box>
              <Button
                  variant={'contained'}
                  color={'primary'}
                  fullWidth
                  sx={{mt:2}}
                  onClick={handleSubmit}
                  disabled={
                      values?.pinCode.length !== 6||
                      values?.name === '' ||
                      values?.city === '' ||
                      values?.state === ''||
                      values?.addressLine1 === ''||
                      values?.relationType === ''||
                      src === ''||loading
                  }
              >
                  {each?'SAVE CHANGES':'ADD FAMILY MEMBER'}
              </Button>
          </Box>

      </>
    );
};

export default withCropper(AddEditFmember);