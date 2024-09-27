import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import client from "../../services/restClient";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import ProjectLayout from "../Layouts/ProjectLayout";


const SingleCalonPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState();

    const [Latihan, setLatihan] = useState([]);

    useEffect(() => {
        //on mount
        client
            .service("calon")
            .get(urlParams.singleCalonId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },"Latihan"] }})
            .then((res) => {
                set_entity(res || {});
                const Latihan = Array.isArray(res.Latihan)
            ? res.Latihan.map((elem) => ({ _id: elem._id, Tajuk: elem.Tajuk }))
            : res.Latihan
                ? [{ _id: res.Latihan._id, Tajuk: res.Latihan.Tajuk }]
                : [];
        setLatihan(Latihan);
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "Calon", type: "error", message: error.message || "Failed get calon" });
            });
    }, [props,urlParams.singleCalonId]);


    const goBack = () => {
        navigate("/calon");
    };

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-10">
                <div className="flex align-items-center justify-content-start">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">Calon</h3>
                </div>
                <p>calon/{urlParams.singleCalonId}</p>
                {/* ~cb-project-dashboard~ */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Pengguna</label><p className="m-0 ml-3" >{_entity?.Pengguna}</p></div>
<div className="col-12 md:col-6 lg:col-3"><label className="text-sm text-primary">Status</label><p className="m-0 ml-3" >{_entity?.Status}</p></div>
            <div className="col-12 md:col-6 lg:col-3"><label className="text-sm">Latihan</label>
                    {Latihan.map((elem) => (
                        <Link key={elem._id} to={`/latihan/${elem._id}`}>
                            <div className="card">
                                <p className="text-xl text-primary">{elem.Tajuk}</p>
                            </div>
                        </Link>
                    ))}</div>

                    <div className="col-12">&nbsp;</div>
                </div>
            </div>
        </div>
        
        </ProjectLayout>
    );
};

const mapState = (state) => {
    const { user, isLoggedIn } = state.auth;
    return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(SingleCalonPage);
