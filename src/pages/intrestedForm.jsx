import React, { useState } from 'react';
import { auth } from '../firebase/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import { Navigate } from 'react-router-dom';

const InterestedForm = () => {
    const location = useLocation();
    const [form, setForm] = useState({
        name: '',
        email: '',
        purpose: '',
        itemId: location.state?.itemId || '',
        timestamp: serverTimestamp(),
        userId: auth.currentUser ? auth.currentUser.uid : null,
        giverId: location.state?.giverId || '',
        isAccepts: false,
        isRejects: false,
    });

    const [submitted, setSubmitted] = useState(false);


    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // You can handle form submission here (e.g., send to API)

        await addDoc(collection(db, 'interestedForms'), {
            ...form,
        }).then(navigate('/freebie'))


        toast.success("Thak you for your interest, catch you soon", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
        })

    };

    return (
        <section style={{ maxWidth: 400, margin: '0 auto' }} className='poppins-regular p-6 bg-white shadow-md rounded-lg mt-20'>
            <h2>Interested Form</h2>

            <form onSubmit={handleSubmit} className='poppins-regular  p-6 bg-white shadow-md rounded-lg mt-20'>
                <div className="mb-4">

                    <label className="block font-medium mb-1">Name</label>
                    <input
                        type="text"
                        name='name'
                        placeholder="Enter your name"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                        value={form.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">

                    <label className="block font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name='email'
                        placeholder="Enter your email"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">

                    <label className="block font-medium mb-1">Purpose:</label>
                    <textarea
                        placeholder="Describe your item..."
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                        name="purpose"
                        value={form.purpose}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition duration-300">
                    Submit
                </button>
            </form>

        </section>
    );
};

export default InterestedForm;