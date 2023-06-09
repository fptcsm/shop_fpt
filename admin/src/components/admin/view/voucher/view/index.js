import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from "@material-ui/core";
import { GetPaymentDetails } from "../../../../services";
import { NotificationManager } from "react-notifications";
import Loader from "../../../../loader";
import swal from "sweetalert";
import AddVoucher from './AddVoucher';
import get_list_voucher from '../../../../../api/get_list_voucher';
import moment from 'moment';
import delete_voucher from '../../../../../api/delete_voucher';
import VoucherSchedule from './VoucherSchedule';

const View = () => {
  const history = useHistory();
  const [getList, setGetList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [change, setChange]= useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoaded(true);
      await getCustomer();
    };
    fetchData();
  }, [change]);

  const handleBack = () => {
    history.goBack();
  };

  const getCustomer = async () => {
    let list = await get_list_voucher();
    if (list) {
      setGetList(list.data);
      setIsLoaded(false);
    }
  };

  const handlDeleteById = async (id) => {
    swal({
      title: "Are you sure?",
      text: "You want to delete User from the List",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (success) => {
      if (success) {
        let value = await GetPaymentDetails.getDeleteUserList(id);
        if (value) {
          NotificationManager.success(value.msg, "Status");
          setTimeout(async function () {
            window.location.reload();
          }, 1000);
        }
      }
    });
  };

  const handlEditRow = (row) => {
    history.push({
      pathname: `/admin/user/edit/${row.id}`,
      state: row,
    });
  };

  const handleAddNewUser = () => {
    history.push({ pathname: `/admin/user/create` });
  };

  return (
    <div className="container-fluid">
      <div className="row">
      
        <div className="col-lg-5 col-md-9 col-lg-6">
          <h2 className="mt-30 page-title">Voucher List</h2>
        </div>
        <div className="col-lg-5 col-md-3 col-lg-6 back-btn">
          <Button variant="contained" onClick={handleBack}>
            <i className="fas fa-arrow-left" /> Back
          </Button>
        </div>
      </div>
      <ol className="breadcrumb mb-30">
        <li className="breadcrumb-item">Dashboard</li>
        <li className="breadcrumb-item active">voucher</li>
      </ol>
      <div className="row justify-content-between">
        <div className="col-lg-3 col-md-4">
          <div className="bulk-section mt-30">
            <div className="input-group">
              <div className="input-group-append">
                <VoucherSchedule />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5 col-md-3 col-lg-6 back-btn">
          <AddVoucher setChange={setChange} />
        </div>
        <div className="col-lg-12 col-md-12">
          {isLoaded ? <Loader /> : ""}
          <div className="card card-static-2 mt-30 mb-30">
            <div className="card-title-2">
              <h4>All Voucher</h4>
            </div>
            <div className="card-body-table">
              <div className="table-responsive">
                <table className="table ucp-table table-hover">
                  <thead>
                    <tr>
                      <th style={{ width: 60 }}>ID</th>
                      <th>Code</th>
                      <th>Expire</th>
                      <th>Discount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getList.map((row, index) => (
                      <tr key={index}>
                        <td>{++index}</td>
                        <td>{row.code}</td>
                        <td>
                          {moment(row.expire).format("DD-MM-YYYY HH:mm")}
                        </td>
                        <td>VND{row.discount}</td>
                        <td>
                          <div onClick={()=> {
                            swal("Thông báo", "Bạn có muốn xóa voucher này không ? ", {buttons: {
                              ok: "Ok",
                              cancel: "Cancel"
                            }})
                            .then(async value=> {
                              if(value=== "ok") {
                                const result= await delete_voucher(row.id)
                                if(result.ok=== true) {
                                  swal("Thông báo", "Xóa thành công", "success")
                                  .then(()=> setGetList(getList.filter(item=> item.id != row.id)))
                                }
                                else {
                                  swal("Thông báo", "Xóa thất bại", "error")
                                }
                              }
                            })
                          }} title={"Delete"}>
                            <i className="fas fa-trash-alt" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
