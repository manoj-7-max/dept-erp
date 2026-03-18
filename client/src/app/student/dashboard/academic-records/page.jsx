"use client";
import React, { Suspense } from 'react';
import AcademicRecords from '@/student-portal/pages/AcademicRecords';

export default function AcademicRecordsRoute() { 
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading academic records...</div>}>
            <AcademicRecords />
        </Suspense>
    ); 
}
