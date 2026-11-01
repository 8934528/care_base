import React, { useState } from "react";
import { registerPatient } from "../../services/patientService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { Card, Button, PageHeader } from "../../components/common";

export default function PatientRegistration() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    gender: "Male",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalHistory: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.idNumber || !form.phone) {
      showToast("Please fill in all mandatory fields.", "warning");
      return;
    }

    setLoading(true);

    const payload = {
      ...form,
      dateOfBirth: form.dateOfBirth ? form.dateOfBirth : undefined
    };

    try {
      const res = await registerPatient(payload);
      showToast(`Patient successfully registered (${res.patientRef}).`, "success");
      navigate(`/patients/profile/${res.patientRef}`);
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } } };
      showToast(errObj.response?.data?.message || "Registration failed.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cb-page container-fluid px-0">
      <PageHeader
        title="Patient Registration"
        subtitle="Intake and registration for new healthcare facility patients"
        actions={
          <Button variant="outline" icon="bi-arrow-left" onClick={() => navigate("/patients")}>
            Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <Card title="Personal Demographics" className="mb-3">
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label" htmlFor="firstName">First Name *</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="form-control cb-form-control"
                    placeholder="e.g. Sipho"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label" htmlFor="lastName">Last Name *</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="form-control cb-form-control"
                    placeholder="e.g. Khumalo"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label" htmlFor="idNumber">National ID / Passport *</label>
                  <input
                    id="idNumber"
                    name="idNumber"
                    type="text"
                    className="form-control cb-form-control"
                    placeholder="13-digit National ID or passport"
                    value={form.idNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label" htmlFor="gender">Gender *</label>
                  <select
                    id="gender"
                    name="gender"
                    className="form-select cb-form-select"
                    value={form.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    className="form-control cb-form-control"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </Card>

            <Card title="Emergency Contact Details">
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label" htmlFor="emergencyContactName">Contact Full Name</label>
                  <input
                    id="emergencyContactName"
                    name="emergencyContactName"
                    type="text"
                    className="form-control cb-form-control"
                    placeholder="Next of kin name"
                    value={form.emergencyContactName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label" htmlFor="emergencyContactPhone">Contact Phone</label>
                  <input
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    type="tel"
                    className="form-control cb-form-control"
                    placeholder="+27 82 000 0000"
                    value={form.emergencyContactPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="col-12 col-lg-6">
            <Card title="Contact & Residence Information" className="mb-3">
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label" htmlFor="phone">Mobile Phone Number *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-control cb-form-control"
                    placeholder="+27 82 000 0000"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control cb-form-control"
                    placeholder="patient@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="address">Residential Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    className="form-control cb-form-control"
                    placeholder="Street, suburb, city, postal code"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </Card>

            <Card title="Medical Background & Known Conditions" className="mb-3">
              <label className="form-label" htmlFor="medicalHistory">Past Conditions, Allergies, or Chronic Medications</label>
              <textarea
                id="medicalHistory"
                name="medicalHistory"
                rows={4}
                className="form-control cb-form-control"
                placeholder="Document any known allergies, chronic illnesses (e.g., hypertension, diabetes), or previous surgeries..."
                value={form.medicalHistory}
                onChange={handleChange}
              />
            </Card>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="ghost" type="button" onClick={() => navigate("/patients")}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={loading} icon="bi-check-lg">
                Complete Registration
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
