import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function EditCompanyProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    id: "",
    companyName: "",
    hrName: "",
    phone: "",
    website: "",
    industry: "",
    companySize: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/employer/profile/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProfile({
        id: response.data.id,
        companyName: response.data.companyName || "",
        hrName: response.data.hrName || "",
        phone: response.data.phone || "",
        website: response.data.website || "",
        industry: response.data.industry || "",
        companySize: response.data.companySize || "",
        description: response.data.description || "",
      });
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Unable to Load Profile",
        text: "Company profile could not be loaded.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      await axios.put(
        `http://localhost:8080/api/employer/${profile.id}`,
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Company profile updated successfully.",
        confirmButtonColor: "#198754",
      });

      navigate("/employer/profile");
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Unable to update company profile.",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary mb-3"></div>
        <h5>Loading Profile...</h5>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">🏢 Edit Company Profile</h2>
                <p className="text-muted">Update your company information</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Company Name</label>

                  <input
                    type="text"
                    name="companyName"
                    className="form-control"
                    value={profile.companyName}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">HR Name</label>

                  <input
                    type="text"
                    name="hrName"
                    className="form-control"
                    value={profile.hrName}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone</label>

                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Website</label>

                  <input
                    type="text"
                    name="website"
                    className="form-control"
                    value={profile.website}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Industry</label>

                  <select
                    name="industry"
                    className="form-select"
                    value={profile.industry}
                    onChange={handleChange}
                  >
                    <option value="">Select Industry</option>
                    <option value="IT">IT</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Company Size</label>

                  <select
                    name="companySize"
                    className="form-select"
                    value={profile.companySize}
                    onChange={handleChange}
                  >
                    <option value="">Select Company Size</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Description</label>

                  <textarea
                    name="description"
                    className="form-control"
                    rows="5"
                    value={profile.description}
                    onChange={handleChange}
                    placeholder="Tell candidates about your company..."
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-50"
                    onClick={() => navigate("/employer/profile")}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary w-50"
                    disabled={updating}
                  >
                    {updating ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCompanyProfile;
