import { useParams } from 'react-router-dom';

function DoctorProfile() {
    const { doc_id } = useParams();

    return (
        <div>
            <h2>Welcome, Doctor {doc_id}</h2>
        </div>
    );
}

export default DoctorProfile;
