package com.app.common;

/**
 * Role enum – controls access across the entire application.
 *
 * Roles:
 *   ADMIN       – full system access; can create patient accounts manually
 *   DOCTOR      – can view/manage own patients, appointments, referrals
 *   RECEPTIONIST– manages appointments, queues, admissions
 *   PATIENT     – can view own record, appointments, bills
 *
 * NOTE: Spring Security roles are stored with "ROLE_" prefix internally,
 * but we store the plain name (e.g. "ADMIN") in MongoDB.
 */
public enum Role {
    ADMIN,
    DOCTOR,
    RECEPTIONIST,
    PATIENT
}
