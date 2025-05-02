// File: src/App.tsx

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut, SignIn, SignUp, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

const Navbar = () => (
  <div className="p-4 bg-gray-900 text-white flex justify-between">
    <div className="font-bold">JobBoard</div>
    <div className="flex gap-4">
      <a href="/" className="hover:underline">Home</a>
      <a href="/favorites" className="hover:underline">Favorites</a>
      <a href="/applied" className="hover:underline">Applied</a>
    </div>
  </div>
);

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ job_location: '', job_type: '', experience_level: '' });

  useEffect(() => {
    axios.get(`${apiUrl}/jobs`).then(res => setJobs(res.data));
  }, []);

  const filteredJobs = jobs.filter(job => {
    return (
      (!query || job.job_title.toLowerCase().includes(query.toLowerCase()) || job.company.toLowerCase().includes(query.toLowerCase())) &&
      (!filters.job_location || job.job_location === filters.job_location) &&
      (!filters.job_type || job.job_type === filters.job_type) &&
      (!filters.experience_level || job.experience_level === filters.experience_level)
    );
  });

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <Input placeholder="Search jobs or companies" value={query} onChange={e => setQuery(e.target.value)} />
        <Select onChange={e => setFilters({ ...filters, job_location: e.target.value })}>
          <option value="">All Locations</option>
          {[...new Set(jobs.map(j => j.job_location))].map(loc => <option key={loc}>{loc}</option>)}
        </Select>
        <Select onChange={e => setFilters({ ...filters, job_type: e.target.value })}>
          <option value="">All Types</option>
          {[...new Set(jobs.map(j => j.job_type))].map(type => <option key={type}>{type}</option>)}
        </Select>
        <Select onChange={e => setFilters({ ...filters, experience_level: e.target.value })}>
          <option value="">All Levels</option>
          {[...new Set(jobs.map(j => j.experience_level))].map(level => <option key={level}>{level}</option>)}
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredJobs.map((job, idx) => (
          <Card key={job.id}>
            <CardContent className="p-4">
              <div className="text-xl font-bold">{job.job_title}</div>
              <div className="text-sm text-gray-600">{job.company} - {job.job_location}</div>
              <div className="mt-2">{job.experience_level}, {job.job_type}</div>
              <Button className="mt-2" onClick={() => window.location.href = `/job/${job.id}`}>View</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    axios.get(`${apiUrl}/favorites`).then(res => setFavorites(res.data));
  }, []);

  return (
    <div className="p-4 grid gap-4">
      {favorites.map(job => (
        <Card key={job.id}>
          <CardContent className="p-4">
            <div className="font-bold text-xl">{job.job_title}</div>
            <div className="text-sm text-gray-600">{job.company} - {job.job_location}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const AppliedJobs = () => {
  const [applied, setApplied] = useState([]);

  useEffect(() => {
    axios.get(`${apiUrl}/applied`).then(res => setApplied(res.data));
  }, []);

  return (
    <div className="p-4 grid gap-4">
      {applied.map(job => (
        <Card key={job.id}>
          <CardContent className="p-4">
            <div className="font-bold text-xl">{job.job_title}</div>
            <div className="text-sm text-gray-600">{job.company} - {job.job_location}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${apiUrl}/jobs/${id}`).then(res => setJob(res.data));
  }, [id]);

  const handleSave = () => {
    axios.post(`${apiUrl}/favorites`, { jobId: job.id }).then(() => alert('Saved'));
  };

  const handleApply = () => {
    axios.post(`${apiUrl}/applied`, { jobId: job.id }).then(() => navigate('/applied'));
  };

  if (!job) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <div className="text-2xl font-bold mb-2">{job.job_title}</div>
      <div className="text-sm text-gray-500">{job.company} - {job.job_location}</div>
      <div className="my-4 whitespace-pre-line">{job.full_description}</div>
      <Button className="mr-2" onClick={handleSave}>Save</Button>
      <Button onClick={handleApply}>Apply</Button>
    </div>
  );
};

export default function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
          <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />

          <Route path="/" element={<SignedIn><Home /></SignedIn>} />
          <Route path="/favorites" element={<SignedIn><Favorites /></SignedIn>} />
          <Route path="/applied" element={<SignedIn><AppliedJobs /></SignedIn>} />
          <Route path="/job/:id" element={<SignedIn><JobDetail /></SignedIn>} />
          <Route path="*" element={<SignedOut><RedirectToSignIn /></SignedOut>} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}
