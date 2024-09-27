import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../services/restClient";
import _ from "lodash";
import initilization from "../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
      if (Object.hasOwnProperty.call(errorObj.errors, key)) {
        const element = errorObj.errors[key];
        if (element?.message) {
          errMsg[key] = element.message;
        }
      }
    }
    return errMsg.length ? errMsg : errorObj.message ? { error : errorObj.message} : {};
};

const KelulusanCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [Latihan, setLatihan] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [Latihan], setError);
        }
        set_entity({...init});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
          
            if (_.isEmpty(_entity?.Pelulus)) {
                error["Pelulus"] = `Pelulus field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.Status)) {
                error["Status"] = `Status field is required`;
                ret = false;
            }
  
            if (_.isEmpty(_entity?.Komen)) {
                error["Komen"] = `Komen field is required`;
                ret = false;
            }
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            Latihan: _entity?.Latihan?._id,Pelulus: _entity?.Pelulus,Status: _entity?.Status,Komen: _entity?.Komen,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("kelulusan").create(_data);
        const eagerResult = await client
            .service("kelulusan")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "Latihan",
                    service : "latihan",
                    select:["Tajuk"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Kelulusan updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Kelulusan" });
        }
        setLoading(false);
    };

    useEffect(() => {
                    // on mount latihan
                    client
                        .service("latihan")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleLatihanId } })
                        .then((res) => {
                            setLatihan(res.data.map((e) => { return { name: e['Tajuk'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Latihan", type: "error", message: error.message || "Failed get latihan" });
                        });
                }, []);

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const LatihanOptions = Latihan.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create Kelulusan" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="kelulusan-create-dialog-component">
            <div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="Latihan">Latihan:</label>
                <Dropdown id="Latihan" value={_entity?.Latihan?._id} optionLabel="name" optionValue="value" options={LatihanOptions} onChange={(e) => setValByKey("Latihan", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["Latihan"]) ? (
              <p className="m-0" key="error-Latihan">
                {error["Latihan"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="Pelulus">Pelulus:</label>
                <InputText id="Pelulus" className="w-full mb-3 p-inputtext-sm" value={_entity?.Pelulus} onChange={(e) => setValByKey("Pelulus", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["Pelulus"]) ? (
              <p className="m-0" key="error-Pelulus">
                {error["Pelulus"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="Status">Status:</label>
                <InputText id="Status" className="w-full mb-3 p-inputtext-sm" value={_entity?.Status} onChange={(e) => setValByKey("Status", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["Status"]) ? (
              <p className="m-0" key="error-Status">
                {error["Status"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="Komen">Komen:</label>
                <InputText id="Komen" className="w-full mb-3 p-inputtext-sm" value={_entity?.Komen} onChange={(e) => setValByKey("Komen", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["Komen"]) ? (
              <p className="m-0" key="error-Komen">
                {error["Komen"]}
              </p>
            ) : null}
          </small>
            </div>
            <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(KelulusanCreateDialogComponent);
