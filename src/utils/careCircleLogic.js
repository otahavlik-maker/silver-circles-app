/**
 * 🛡️ CARE SYNC UK - SECURITY KERNEL
 * Pillar B: The "Circle of Care" Logic (RBAC)
 */

// EXPORTUJEME role, aby je viděl i zbytek aplikace
export const ROLES = {
    PATIENT: 'PATIENT',       
    NURSE: 'NURSE',           
    FAMILY: 'FAMILY',         
    NEIGHBOR: 'NEIGHBOR',     
  };
  
  // EXPORTUJEME zdroje
  export const RESOURCES = {
    CLINICAL_RECORDS: 'clinical_records', 
    SOCIAL_FEED: 'social_feed',           
    TASKS_SHOPPING: 'tasks_shopping',     
    FINANCIAL_DATA: 'financial_data',     
    SOS_ALERTS: 'sos_alerts',             
  };
  
  /**
   * The Gatekeeper Function
   */
  export const checkPermission = (userRole, resource) => {
    
    // 1. FAMILY ADMIN (Vidí vše)
    if (userRole === ROLES.FAMILY) {
      return true; 
    }
  
    // 2. NURSE (Nevidí finance)
    if (userRole === ROLES.NURSE) {
      if (resource === RESOURCES.FINANCIAL_DATA) return false;
      return true;
    }
  
    // 3. NEIGHBOR (Vidí jen úkoly a sociální feed)
    if (userRole === ROLES.NEIGHBOR) {
      if (resource === RESOURCES.TASKS_SHOPPING) return true;
      if (resource === RESOURCES.SOCIAL_FEED) return true;
      return false;
    }
  
    // 4. PATIENT
    if (userRole === ROLES.PATIENT) {
      return true;
    }
  
    return false; // Default: Deny All
  };