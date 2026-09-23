import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CompanyProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({});

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const email = localStorage.getItem("email");
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:8080/api/employer/profile/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setProfile(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-4">🏢 Company Profile</h2>

        <p>
          <strong>Company Name :</strong> {profile.companyName}
        </p>

        <p>
          <strong>HR Name :</strong> {profile.hrName}
        </p>

        <p>
          <strong>Phone :</strong> {profile.phone}
        </p>

        <p>
          <strong>Website :</strong> {profile.website}
        </p>

        <p>
          <strong>Industry :</strong> {profile.industry}
        </p>

        <p>
          <strong>Company Size :</strong> {profile.companySize}
        </p>

        <p>
          <strong>Description :</strong>
        </p>

        <div className="border rounded p-3 bg-light">{profile.description}</div>

        <button
          className="btn btn-primary mt-4"
          onClick={() => navigate("/employer/edit-profile")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default CompanyProfile;
