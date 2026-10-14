export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  core: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          at: string
          id: number
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          schema_name: string
          table_name: string
          user_id: string | null
        }
        ComputedFields: never
        Insert: {
          action: string
          at?: string
          id?: never
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          schema_name: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          at?: string
          id?: never
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          schema_name?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          created_by: string | null
          entite: string
          entite_id: string
          id: string
          mime_type: string | null
          nom_fichier: string
          organisation_id: string
          storage_path: string
          taille_octets: number | null
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          created_by?: string | null
          entite: string
          entite_id: string
          id?: string
          mime_type?: string | null
          nom_fichier: string
          organisation_id: string
          storage_path: string
          taille_octets?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          entite?: string
          entite_id?: string
          id?: string
          mime_type?: string | null
          nom_fichier?: string
          organisation_id?: string
          storage_path?: string
          taille_octets?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          organisation_id: string
          role: Database["core"]["Enums"]["role_app"]
          user_id: string
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          organisation_id: string
          role: Database["core"]["Enums"]["role_app"]
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          organisation_id?: string
          role?: Database["core"]["Enums"]["role_app"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      numerotations: {
        Row: {
          annee: number
          code: string
          dernier: number
          organisation_id: string
        }
        ComputedFields: never
        Insert: {
          annee: number
          code: string
          dernier?: number
          organisation_id: string
        }
        Update: {
          annee?: number
          code?: string
          dernier?: number
          organisation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "numerotations_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      organisations: {
        Row: {
          actif: boolean
          adresse: string | null
          code: string
          created_at: string
          devise: string
          forme_juridique: string | null
          id: string
          ninea: string | null
          nom: string
          parent_id: string | null
          rccm: string | null
          updated_at: string
        }
        ComputedFields: never
        Insert: {
          actif?: boolean
          adresse?: string | null
          code: string
          created_at?: string
          devise?: string
          forme_juridique?: string | null
          id?: string
          ninea?: string | null
          nom: string
          parent_id?: string | null
          rccm?: string | null
          updated_at?: string
        }
        Update: {
          actif?: boolean
          adresse?: string | null
          code?: string
          created_at?: string
          devise?: string
          forme_juridique?: string | null
          id?: string
          ninea?: string | null
          nom?: string
          parent_id?: string | null
          rccm?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organisations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          actif: boolean
          created_at: string
          email: string | null
          id: string
          nom_complet: string | null
          preferences: NonNullable<Json>
          telephone: string | null
          updated_at: string
        }
        ComputedFields: never
        Insert: {
          actif?: boolean
          created_at?: string
          email?: string | null
          id: string
          nom_complet?: string | null
          preferences?: NonNullable<Json>
          telephone?: string | null
          updated_at?: string
        }
        Update: {
          actif?: boolean
          created_at?: string
          email?: string | null
          id?: string
          nom_complet?: string | null
          preferences?: NonNullable<Json>
          telephone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sites: {
        Row: {
          actif: boolean
          code: string
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          nom: string
          organisation_id: string
          region: string | null
          type: string
        }
        ComputedFields: never
        Insert: {
          actif?: boolean
          code: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom: string
          organisation_id: string
          region?: string | null
          type: string
        }
        Update: {
          actif?: boolean
          code?: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom?: string
          organisation_id?: string
          region?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "sites_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      appliquer_policies_standard: {
        Args: {
          p_read: Database["core"]["Enums"]["role_app"][]
          p_table: unknown
          p_write: Database["core"]["Enums"]["role_app"][]
        }
        Returns: undefined
      }
      bootstrap_admin: {
        Args: { p_email: string; p_org_code: string }
        Returns: undefined
      }
      has_any_role: {
        Args: { p_roles?: Database["core"]["Enums"]["role_app"][] }
        Returns: boolean
      }
      has_role: {
        Args: {
          p_org: string
          p_roles?: Database["core"]["Enums"]["role_app"][]
        }
        Returns: boolean
      }
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
      organisation_ancetres: { Args: { p_org: string }; Returns: string[] }
      peut_voir_organisation: { Args: { p_org: string }; Returns: boolean }
      poser_policies_legacy: {
        Args: {
          p_table: unknown
          p_write: Database["core"]["Enums"]["role_app"][]
        }
        Returns: undefined
      }
      prochain_numero: {
        Args: { p_annee: number; p_code: string; p_org: string }
        Returns: number
      }
    }
    Enums: {
      role_app:
        | "admin"
        | "direction"
        | "finance"
        | "comptable"
        | "logistique"
        | "chef_site"
        | "mine"
        | "hqse"
        | "rh"
        | "chauffeur"
        | "lecteur"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  finance: {
    Tables: {
      budgets: {
        Row: {
          commentaire: string | null
          compte_id: string
          exercice_id: string
          id: string
          mois: number | null
          montant: number
          organisation_id: string
          section_id: string | null
        }
        ComputedFields: never
        Insert: {
          commentaire?: string | null
          compte_id: string
          exercice_id: string
          id?: string
          mois?: number | null
          montant: number
          organisation_id: string
          section_id?: string | null
        }
        Update: {
          commentaire?: string | null
          compte_id?: string
          exercice_id?: string
          id?: string
          mois?: number | null
          montant?: number
          organisation_id?: string
          section_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budgets_compte_id_fkey"
            columns: ["compte_id"]
            isOneToOne: false
            referencedRelation: "comptes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_exercice_id_fkey"
            columns: ["exercice_id"]
            isOneToOne: false
            referencedRelation: "exercices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections_analytiques"
            referencedColumns: ["id"]
          },
        ]
      }
      comptes: {
        Row: {
          actif: boolean
          classe: number | null
          collectif: boolean
          created_at: string
          id: string
          lettrable: boolean
          libelle: string
          numero: string
          organisation_id: string | null
        }
        ComputedFields: never
        Insert: {
          actif?: boolean
          classe?: never
          collectif?: boolean
          created_at?: string
          id?: string
          lettrable?: boolean
          libelle: string
          numero: string
          organisation_id?: string | null
        }
        Update: {
          actif?: boolean
          classe?: never
          collectif?: boolean
          created_at?: string
          id?: string
          lettrable?: boolean
          libelle?: string
          numero?: string
          organisation_id?: string | null
        }
        Relationships: []
      }
      comptes_bancaires: {
        Row: {
          actif: boolean
          banque: string
          code: string
          compte_id: string | null
          date_solde_initial: string | null
          devise: string
          iban: string | null
          id: string
          intitule: string
          journal_id: string | null
          numero_compte: string | null
          organisation_id: string
          solde_initial: number
        }
        ComputedFields: never
        Insert: {
          actif?: boolean
          banque: string
          code: string
          compte_id?: string | null
          date_solde_initial?: string | null
          devise?: string
          iban?: string | null
          id?: string
          intitule: string
          journal_id?: string | null
          numero_compte?: string | null
          organisation_id: string
          solde_initial?: number
        }
        Update: {
          actif?: boolean
          banque?: string
          code?: string
          compte_id?: string | null
          date_solde_initial?: string | null
          devise?: string
          iban?: string | null
          id?: string
          intitule?: string
          journal_id?: string | null
          numero_compte?: string | null
          organisation_id?: string
          solde_initial?: number
        }
        Relationships: [
          {
            foreignKeyName: "comptes_bancaires_compte_id_fkey"
            columns: ["compte_id"]
            isOneToOne: false
            referencedRelation: "comptes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comptes_bancaires_journal_id_fkey"
            columns: ["journal_id"]
            isOneToOne: false
            referencedRelation: "journaux"
            referencedColumns: ["id"]
          },
        ]
      }
      contrat_projets: {
        Row: {
          contrat_id: string
          organisation_id: string
          project_id: string
        }
        ComputedFields: never
        Insert: {
          contrat_id: string
          organisation_id: string
          project_id: string
        }
        Update: {
          contrat_id?: string
          organisation_id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contrat_projets_contrat_id_fkey"
            columns: ["contrat_id"]
            isOneToOne: false
            referencedRelation: "contrats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contrat_projets_contrat_id_fkey"
            columns: ["contrat_id"]
            isOneToOne: false
            referencedRelation: "v_execution_contrats"
            referencedColumns: ["contrat_id"]
          },
        ]
      }
      contrats: {
        Row: {
          client_id: string
          code: string
          created_at: string
          date_debut: string | null
          date_fin: string | null
          devise: string
          id: string
          intitule: string
          notes: string | null
          organisation_id: string
          prix_unitaire_t: number | null
          produit_code: string | null
          reference_marche: string | null
          section_id: string | null
          statut: string
          tonnage_contractuel: number | null
        }
        ComputedFields: never
        Insert: {
          client_id: string
          code: string
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          devise?: string
          id?: string
          intitule: string
          notes?: string | null
          organisation_id: string
          prix_unitaire_t?: number | null
          produit_code?: string | null
          reference_marche?: string | null
          section_id?: string | null
          statut?: string
          tonnage_contractuel?: number | null
        }
        Update: {
          client_id?: string
          code?: string
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          devise?: string
          id?: string
          intitule?: string
          notes?: string | null
          organisation_id?: string
          prix_unitaire_t?: number | null
          produit_code?: string | null
          reference_marche?: string | null
          section_id?: string | null
          statut?: string
          tonnage_contractuel?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contrats_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contrats_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections_analytiques"
            referencedColumns: ["id"]
          },
        ]
      }
      exercices: {
        Row: {
          code: string
          created_at: string
          date_debut: string
          date_fin: string
          id: string
          organisation_id: string
          statut: string
        }
        ComputedFields: never
        Insert: {
          code: string
          created_at?: string
          date_debut: string
          date_fin: string
          id?: string
          organisation_id: string
          statut?: string
        }
        Update: {
          code?: string
          created_at?: string
          date_debut?: string
          date_fin?: string
          id?: string
          organisation_id?: string
          statut?: string
        }
        Relationships: []
      }
      facture_lignes: {
        Row: {
          compte_id: string | null
          delivery_id: string | null
          designation: string
          facture_id: string
          id: string
          montant_ht: number | null
          ordre: number
          organisation_id: string
          prix_unitaire: number
          quantite: number
          section_id: string | null
          taux_tva: number
          unite: string | null
        }
        ComputedFields: never
        Insert: {
          compte_id?: string | null
          delivery_id?: string | null
          designation: string
          facture_id: string
          id?: string
          montant_ht?: never
          ordre?: number
          organisation_id: string
          prix_unitaire?: number
          quantite?: number
          section_id?: string | null
          taux_tva?: number
          unite?: string | null
        }
        Update: {
          compte_id?: string | null
          delivery_id?: string | null
          designation?: string
          facture_id?: string
          id?: string
          montant_ht?: never
          ordre?: number
          organisation_id?: string
          prix_unitaire?: number
          quantite?: number
          section_id?: string | null
          taux_tva?: number
          unite?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facture_lignes_compte_id_fkey"
            columns: ["compte_id"]
            isOneToOne: false
            referencedRelation: "comptes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facture_lignes_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "factures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facture_lignes_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "v_factures_soldes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facture_lignes_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections_analytiques"
            referencedColumns: ["id"]
          },
        ]
      }
      factures: {
        Row: {
          contrat_id: string | null
          created_at: string
          created_by: string | null
          date_echeance: string | null
          date_facture: string
          devise: string
          exoneration_tva: string | null
          id: string
          montant_ht: number
          montant_ttc: number | null
          montant_tva: number
          numero: string | null
          objet: string | null
          organisation_id: string
          piece_id: string | null
          sens: string
          statut: string
          tiers_id: string
        }
        ComputedFields: never
        Insert: {
          contrat_id?: string | null
          created_at?: string
          created_by?: string | null
          date_echeance?: string | null
          date_facture: string
          devise?: string
          exoneration_tva?: string | null
          id?: string
          montant_ht?: number
          montant_ttc?: never
          montant_tva?: number
          numero?: string | null
          objet?: string | null
          organisation_id: string
          piece_id?: string | null
          sens: string
          statut?: string
          tiers_id: string
        }
        Update: {
          contrat_id?: string | null
          created_at?: string
          created_by?: string | null
          date_echeance?: string | null
          date_facture?: string
          devise?: string
          exoneration_tva?: string | null
          id?: string
          montant_ht?: number
          montant_ttc?: never
          montant_tva?: number
          numero?: string | null
          objet?: string | null
          organisation_id?: string
          piece_id?: string | null
          sens?: string
          statut?: string
          tiers_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "factures_contrat_id_fkey"
            columns: ["contrat_id"]
            isOneToOne: false
            referencedRelation: "contrats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_contrat_id_fkey"
            columns: ["contrat_id"]
            isOneToOne: false
            referencedRelation: "v_execution_contrats"
            referencedColumns: ["contrat_id"]
          },
          {
            foreignKeyName: "factures_piece_id_fkey"
            columns: ["piece_id"]
            isOneToOne: false
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_tiers_id_fkey"
            columns: ["tiers_id"]
            isOneToOne: false
            referencedRelation: "tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      journaux: {
        Row: {
          actif: boolean
          code: string
          compte_contrepartie_id: string | null
          id: string
          libelle: string
          organisation_id: string
          type_journal: string
        }
        ComputedFields: never
        Insert: {
          actif?: boolean
          code: string
          compte_contrepartie_id?: string | null
          id?: string
          libelle: string
          organisation_id: string
          type_journal: string
        }
        Update: {
          actif?: boolean
          code?: string
          compte_contrepartie_id?: string | null
          id?: string
          libelle?: string
          organisation_id?: string
          type_journal?: string
        }
        Relationships: [
          {
            foreignKeyName: "journaux_compte_contrepartie_id_fkey"
            columns: ["compte_contrepartie_id"]
            isOneToOne: false
            referencedRelation: "comptes"
            referencedColumns: ["id"]
          },
        ]
      }
      lignes: {
        Row: {
          compte_id: string
          credit: number
          debit: number
          echeance: string | null
          id: string
          lettrage: string | null
          libelle: string | null
          ordre: number
          organisation_id: string
          piece_id: string
          section_id: string | null
          tiers_id: string | null
        }
        ComputedFields: never
        Insert: {
          compte_id: string
          credit?: number
          debit?: number
          echeance?: string | null
          id?: string
          lettrage?: string | null
          libelle?: string | null
          ordre?: number
          organisation_id: string
          piece_id: string
          section_id?: string | null
          tiers_id?: string | null
        }
        Update: {
          compte_id?: string
          credit?: number
          debit?: number
          echeance?: string | null
          id?: string
          lettrage?: string | null
          libelle?: string | null
          ordre?: number
          organisation_id?: string
          piece_id?: string
          section_id?: string | null
          tiers_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lignes_compte_id_fkey"
            columns: ["compte_id"]
            isOneToOne: false
            referencedRelation: "comptes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lignes_piece_id_fkey"
            columns: ["piece_id"]
            isOneToOne: false
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lignes_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections_analytiques"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lignes_tiers_id_fkey"
            columns: ["tiers_id"]
            isOneToOne: false
            referencedRelation: "tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      pieces: {
        Row: {
          created_at: string
          created_by: string | null
          date_piece: string
          exercice_id: string
          id: string
          journal_id: string
          libelle: string
          numero: string | null
          organisation_id: string
          reference_externe: string | null
          source_id: string | null
          source_module: string | null
          statut: string
          valide_le: string | null
          valide_par: string | null
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          created_by?: string | null
          date_piece: string
          exercice_id: string
          id?: string
          journal_id: string
          libelle: string
          numero?: string | null
          organisation_id: string
          reference_externe?: string | null
          source_id?: string | null
          source_module?: string | null
          statut?: string
          valide_le?: string | null
          valide_par?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date_piece?: string
          exercice_id?: string
          id?: string
          journal_id?: string
          libelle?: string
          numero?: string | null
          organisation_id?: string
          reference_externe?: string | null
          source_id?: string | null
          source_module?: string | null
          statut?: string
          valide_le?: string | null
          valide_par?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pieces_exercice_id_fkey"
            columns: ["exercice_id"]
            isOneToOne: false
            referencedRelation: "exercices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pieces_journal_id_fkey"
            columns: ["journal_id"]
            isOneToOne: false
            referencedRelation: "journaux"
            referencedColumns: ["id"]
          },
        ]
      }
      reglements: {
        Row: {
          compte_bancaire_id: string | null
          created_at: string
          created_by: string | null
          date_reglement: string
          facture_id: string
          id: string
          mode: string
          montant: number
          organisation_id: string
          piece_id: string | null
          reference: string | null
        }
        ComputedFields: never
        Insert: {
          compte_bancaire_id?: string | null
          created_at?: string
          created_by?: string | null
          date_reglement: string
          facture_id: string
          id?: string
          mode: string
          montant: number
          organisation_id: string
          piece_id?: string | null
          reference?: string | null
        }
        Update: {
          compte_bancaire_id?: string | null
          created_at?: string
          created_by?: string | null
          date_reglement?: string
          facture_id?: string
          id?: string
          mode?: string
          montant?: number
          organisation_id?: string
          piece_id?: string | null
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reglements_compte_bancaire_id_fkey"
            columns: ["compte_bancaire_id"]
            isOneToOne: false
            referencedRelation: "comptes_bancaires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reglements_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "factures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reglements_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "v_factures_soldes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reglements_piece_id_fkey"
            columns: ["piece_id"]
            isOneToOne: false
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
        ]
      }
      releves_bancaires: {
        Row: {
          compte_bancaire_id: string
          date_operation: string
          date_valeur: string | null
          id: string
          importe_le: string
          libelle: string
          ligne_id: string | null
          montant: number
          organisation_id: string
          reference: string | null
          reglement_id: string | null
        }
        ComputedFields: never
        Insert: {
          compte_bancaire_id: string
          date_operation: string
          date_valeur?: string | null
          id?: string
          importe_le?: string
          libelle: string
          ligne_id?: string | null
          montant: number
          organisation_id: string
          reference?: string | null
          reglement_id?: string | null
        }
        Update: {
          compte_bancaire_id?: string
          date_operation?: string
          date_valeur?: string | null
          id?: string
          importe_le?: string
          libelle?: string
          ligne_id?: string | null
          montant?: number
          organisation_id?: string
          reference?: string | null
          reglement_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "releves_bancaires_compte_bancaire_id_fkey"
            columns: ["compte_bancaire_id"]
            isOneToOne: false
            referencedRelation: "comptes_bancaires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "releves_bancaires_ligne_id_fkey"
            columns: ["ligne_id"]
            isOneToOne: false
            referencedRelation: "lignes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "releves_bancaires_reglement_id_fkey"
            columns: ["reglement_id"]
            isOneToOne: false
            referencedRelation: "reglements"
            referencedColumns: ["id"]
          },
        ]
      }
      sections_analytiques: {
        Row: {
          actif: boolean
          axe: string
          code: string
          id: string
          libelle: string
          organisation_id: string
          site_id: string | null
        }
        ComputedFields: never
        Insert: {
          actif?: boolean
          axe: string
          code: string
          id?: string
          libelle: string
          organisation_id: string
          site_id?: string | null
        }
        Update: {
          actif?: boolean
          axe?: string
          code?: string
          id?: string
          libelle?: string
          organisation_id?: string
          site_id?: string | null
        }
        Relationships: []
      }
      tiers: {
        Row: {
          actif: boolean
          adresse: string | null
          code: string
          compte_collectif_id: string | null
          created_at: string
          delai_paiement_jours: number
          email: string | null
          id: string
          ninea: string | null
          nom: string
          organisation_id: string
          pays: string
          rccm: string | null
          telephone: string | null
          type_tiers: string
        }
        ComputedFields: never
        Insert: {
          actif?: boolean
          adresse?: string | null
          code: string
          compte_collectif_id?: string | null
          created_at?: string
          delai_paiement_jours?: number
          email?: string | null
          id?: string
          ninea?: string | null
          nom: string
          organisation_id: string
          pays?: string
          rccm?: string | null
          telephone?: string | null
          type_tiers: string
        }
        Update: {
          actif?: boolean
          adresse?: string | null
          code?: string
          compte_collectif_id?: string | null
          created_at?: string
          delai_paiement_jours?: number
          email?: string | null
          id?: string
          ninea?: string | null
          nom?: string
          organisation_id?: string
          pays?: string
          rccm?: string | null
          telephone?: string | null
          type_tiers?: string
        }
        Relationships: [
          {
            foreignKeyName: "tiers_compte_collectif_id_fkey"
            columns: ["compte_collectif_id"]
            isOneToOne: false
            referencedRelation: "comptes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_balance: {
        Row: {
          classe: number | null
          compte: string | null
          exercice_id: string | null
          libelle: string | null
          organisation_id: string | null
          solde_crediteur: number | null
          solde_debiteur: number | null
          total_credit: number | null
          total_debit: number | null
        }
        ComputedFields: never
        Relationships: [
          {
            foreignKeyName: "pieces_exercice_id_fkey"
            columns: ["exercice_id"]
            isOneToOne: false
            referencedRelation: "exercices"
            referencedColumns: ["id"]
          },
        ]
      }
      v_budget_realise: {
        Row: {
          budget: number | null
          compte: string | null
          compte_id: string | null
          compte_libelle: string | null
          ecart: number | null
          exercice_id: string | null
          organisation_id: string | null
          realise: number | null
          section_id: string | null
        }
        ComputedFields: never
        Relationships: []
      }
      v_execution_contrats: {
        Row: {
          ca_livre_theorique: number | null
          client: string | null
          code: string | null
          contrat_id: string | null
          intitule: string | null
          nombre_bl: number | null
          organisation_id: string | null
          prix_unitaire_t: number | null
          taux_execution_pct: number | null
          tonnage_contractuel: number | null
          tonnage_livre: number | null
        }
        ComputedFields: never
        Relationships: []
      }
      v_factures_soldes: {
        Row: {
          contrat_id: string | null
          created_at: string | null
          created_by: string | null
          date_echeance: string | null
          date_facture: string | null
          devise: string | null
          exoneration_tva: string | null
          id: string | null
          jours_de_retard: number | null
          montant_ht: number | null
          montant_regle: number | null
          montant_ttc: number | null
          montant_tva: number | null
          numero: string | null
          objet: string | null
          organisation_id: string | null
          piece_id: string | null
          reste_du: number | null
          sens: string | null
          statut: string | null
          tiers_id: string | null
          tiers_nom: string | null
        }
        ComputedFields: never
        Relationships: [
          {
            foreignKeyName: "factures_contrat_id_fkey"
            columns: ["contrat_id"]
            isOneToOne: false
            referencedRelation: "contrats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_contrat_id_fkey"
            columns: ["contrat_id"]
            isOneToOne: false
            referencedRelation: "v_execution_contrats"
            referencedColumns: ["contrat_id"]
          },
          {
            foreignKeyName: "factures_piece_id_fkey"
            columns: ["piece_id"]
            isOneToOne: false
            referencedRelation: "pieces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_tiers_id_fkey"
            columns: ["tiers_id"]
            isOneToOne: false
            referencedRelation: "tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      v_grand_livre: {
        Row: {
          compte: string | null
          compte_libelle: string | null
          credit: number | null
          date_piece: string | null
          debit: number | null
          exercice_id: string | null
          journal: string | null
          lettrage: string | null
          libelle: string | null
          numero: string | null
          organisation_id: string | null
          section: string | null
          solde_progressif: number | null
          tiers_code: string | null
          tiers_nom: string | null
        }
        ComputedFields: never
        Relationships: [
          {
            foreignKeyName: "pieces_exercice_id_fkey"
            columns: ["exercice_id"]
            isOneToOne: false
            referencedRelation: "exercices"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      valider_piece: { Args: { p_piece: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  livraisons: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      v_allocations: {
        Row: {
          allocation_key: string | null
          commune: string | null
          commune_id: string | null
          coop_name: string | null
          departement: string | null
          department_id: string | null
          derniere_livraison: string | null
          est_cooperative: boolean | null
          id: string | null
          nombre_bl: number | null
          numero_phase: number | null
          operateur: string | null
          operator_id: string | null
          project_description: string | null
          project_id: string | null
          region: string | null
          region_id: string | null
          responsable: string | null
          statut: Database["public"]["Enums"]["allocation_status"] | null
          taux_pct: number | null
          telephone_responsable: string | null
          tonnage_cible: number | null
          tonnage_livre: number | null
        }
        ComputedFields: never
        Relationships: [
          {
            foreignKeyName: "allocations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_avancement_projets"
            referencedColumns: ["project_id"]
          },
        ]
      }
      v_avancement_projets: {
        Row: {
          allocations_soldees: number | null
          date_mise_disposition: string | null
          derniere_livraison: string | null
          nombre_allocations: number | null
          nombre_bl: number | null
          numero_bon_disposition: string | null
          numero_marche: string | null
          numero_phase: number | null
          project_description: string | null
          project_id: string | null
          tonnage_alloue: number | null
          tonnage_livre: number | null
          tonnage_mis_a_disposition: number | null
          visible: boolean | null
        }
        ComputedFields: never
        Relationships: []
      }
      v_avancement_regions: {
        Row: {
          nombre_bl: number | null
          numero_phase: number | null
          project_id: string | null
          region: string | null
          region_id: string | null
          tonnage_cible: number | null
          tonnage_livre: number | null
        }
        ComputedFields: never
        Relationships: [
          {
            foreignKeyName: "allocations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_avancement_projets"
            referencedColumns: ["project_id"]
          },
        ]
      }
      v_bons: {
        Row: {
          allocation_id: string | null
          allocation_key: string | null
          bl_number: string | null
          camion_interne: boolean | null
          chauffeur: string | null
          commune: string | null
          declaration_code: string | null
          delivery_date: string | null
          frais_total: number | null
          id: string | null
          immatriculation: string | null
          numero_phase: number | null
          operateur: string | null
          project_id: string | null
          region: string | null
          tonnage_loaded: number | null
          transporteur: string | null
        }
        ComputedFields: never
        Relationships: [
          {
            foreignKeyName: "allocations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_avancement_projets"
            referencedColumns: ["project_id"]
          },
        ]
      }
      v_livraisons_journalieres: {
        Row: {
          jour: string | null
          nombre_bl: number | null
          project_id: string | null
          tonnage: number | null
        }
        ComputedFields: never
        Relationships: [
          {
            foreignKeyName: "allocations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_avancement_projets"
            referencedColumns: ["project_id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  mine: {
    Tables: {
      analyses: {
        Row: {
          autres_resultats: Json | null
          cao_pct: number | null
          conforme: boolean | null
          created_at: string
          date_prelevement: string
          front_id: string | null
          granulometrie: string | null
          humidite_pct: number | null
          id: string
          laboratoire: string | null
          organisation_id: string
          p2o5_pct: number | null
          produit_code: string | null
          reference_echantillon: string
        }
        ComputedFields: never
        Insert: {
          autres_resultats?: Json | null
          cao_pct?: number | null
          conforme?: boolean | null
          created_at?: string
          date_prelevement: string
          front_id?: string | null
          granulometrie?: string | null
          humidite_pct?: number | null
          id?: string
          laboratoire?: string | null
          organisation_id: string
          p2o5_pct?: number | null
          produit_code?: string | null
          reference_echantillon: string
        }
        Update: {
          autres_resultats?: Json | null
          cao_pct?: number | null
          conforme?: boolean | null
          created_at?: string
          date_prelevement?: string
          front_id?: string | null
          granulometrie?: string | null
          humidite_pct?: number | null
          id?: string
          laboratoire?: string | null
          organisation_id?: string
          p2o5_pct?: number | null
          produit_code?: string | null
          reference_echantillon?: string
        }
        Relationships: [
          {
            foreignKeyName: "analyses_front_id_fkey"
            columns: ["front_id"]
            isOneToOne: false
            referencedRelation: "fronts"
            referencedColumns: ["id"]
          },
        ]
      }
      courriers: {
        Row: {
          created_at: string
          created_by: string | null
          date_courrier: string
          date_limite_reponse: string | null
          destinataire: string | null
          expediteur: string | null
          id: string
          nature: string
          objet: string
          obligation_id: string | null
          organisation_id: string
          reference: string | null
          reponse_a: string | null
          resume: string | null
          sens: string
          statut: string
          titre_id: string | null
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          created_by?: string | null
          date_courrier: string
          date_limite_reponse?: string | null
          destinataire?: string | null
          expediteur?: string | null
          id?: string
          nature?: string
          objet: string
          obligation_id?: string | null
          organisation_id: string
          reference?: string | null
          reponse_a?: string | null
          resume?: string | null
          sens: string
          statut?: string
          titre_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date_courrier?: string
          date_limite_reponse?: string | null
          destinataire?: string | null
          expediteur?: string | null
          id?: string
          nature?: string
          objet?: string
          obligation_id?: string | null
          organisation_id?: string
          reference?: string | null
          reponse_a?: string | null
          resume?: string | null
          sens?: string
          statut?: string
          titre_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courriers_obligation_id_fkey"
            columns: ["obligation_id"]
            isOneToOne: false
            referencedRelation: "obligations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courriers_obligation_id_fkey"
            columns: ["obligation_id"]
            isOneToOne: false
            referencedRelation: "v_obligations_suivi"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courriers_reponse_a_fkey"
            columns: ["reponse_a"]
            isOneToOne: false
            referencedRelation: "courriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courriers_titre_id_fkey"
            columns: ["titre_id"]
            isOneToOne: false
            referencedRelation: "titres"
            referencedColumns: ["id"]
          },
        ]
      }
      engins: {
        Row: {
          code: string
          compteur_heures: number | null
          cout_horaire: number | null
          created_at: string
          id: string
          immatriculation: string | null
          marque: string | null
          modele: string | null
          numero_serie: string | null
          organisation_id: string
          prestataire: string | null
          regime: string
          site_id: string | null
          statut: string
          type_engin: string
        }
        ComputedFields: never
        Insert: {
          code: string
          compteur_heures?: number | null
          cout_horaire?: number | null
          created_at?: string
          id?: string
          immatriculation?: string | null
          marque?: string | null
          modele?: string | null
          numero_serie?: string | null
          organisation_id: string
          prestataire?: string | null
          regime?: string
          site_id?: string | null
          statut?: string
          type_engin: string
        }
        Update: {
          code?: string
          compteur_heures?: number | null
          cout_horaire?: number | null
          created_at?: string
          id?: string
          immatriculation?: string | null
          marque?: string | null
          modele?: string | null
          numero_serie?: string | null
          organisation_id?: string
          prestataire?: string | null
          regime?: string
          site_id?: string | null
          statut?: string
          type_engin?: string
        }
        Relationships: []
      }
      extractions: {
        Row: {
          created_at: string
          created_by: string | null
          date_extraction: string
          front_id: string | null
          id: string
          methode_mesure: string | null
          nb_voyages: number | null
          notes: string | null
          organisation_id: string
          poste: string
          site_id: string
          tonnage_minerai: number
          tonnage_sterile: number
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          created_by?: string | null
          date_extraction: string
          front_id?: string | null
          id?: string
          methode_mesure?: string | null
          nb_voyages?: number | null
          notes?: string | null
          organisation_id: string
          poste?: string
          site_id: string
          tonnage_minerai?: number
          tonnage_sterile?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date_extraction?: string
          front_id?: string | null
          id?: string
          methode_mesure?: string | null
          nb_voyages?: number | null
          notes?: string | null
          organisation_id?: string
          poste?: string
          site_id?: string
          tonnage_minerai?: number
          tonnage_sterile?: number
        }
        Relationships: [
          {
            foreignKeyName: "extractions_front_id_fkey"
            columns: ["front_id"]
            isOneToOne: false
            referencedRelation: "fronts"
            referencedColumns: ["id"]
          },
        ]
      }
      fronts: {
        Row: {
          code: string
          created_at: string
          geojson: Json | null
          id: string
          nom: string | null
          organisation_id: string
          ratio_decouverture: number | null
          reserves_estimees_t: number | null
          site_id: string | null
          statut: string
          teneur_p2o5_moy_pct: number | null
          titre_id: string | null
        }
        ComputedFields: never
        Insert: {
          code: string
          created_at?: string
          geojson?: Json | null
          id?: string
          nom?: string | null
          organisation_id: string
          ratio_decouverture?: number | null
          reserves_estimees_t?: number | null
          site_id?: string | null
          statut?: string
          teneur_p2o5_moy_pct?: number | null
          titre_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          geojson?: Json | null
          id?: string
          nom?: string | null
          organisation_id?: string
          ratio_decouverture?: number | null
          reserves_estimees_t?: number | null
          site_id?: string | null
          statut?: string
          teneur_p2o5_moy_pct?: number | null
          titre_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fronts_titre_id_fkey"
            columns: ["titre_id"]
            isOneToOne: false
            referencedRelation: "titres"
            referencedColumns: ["id"]
          },
        ]
      }
      obligations: {
        Row: {
          base_calcul: Json | null
          created_at: string
          date_paiement: string | null
          echeance: string | null
          id: string
          libelle: string
          montant_du: number | null
          montant_paye: number
          notes: string | null
          organisation_id: string
          periode_debut: string | null
          periode_fin: string | null
          reference_paiement: string | null
          statut: Database["mine"]["Enums"]["statut_obligation"]
          titre_id: string | null
          type_obligation: Database["mine"]["Enums"]["type_obligation"]
          updated_at: string
        }
        ComputedFields: never
        Insert: {
          base_calcul?: Json | null
          created_at?: string
          date_paiement?: string | null
          echeance?: string | null
          id?: string
          libelle: string
          montant_du?: number | null
          montant_paye?: number
          notes?: string | null
          organisation_id: string
          periode_debut?: string | null
          periode_fin?: string | null
          reference_paiement?: string | null
          statut?: Database["mine"]["Enums"]["statut_obligation"]
          titre_id?: string | null
          type_obligation: Database["mine"]["Enums"]["type_obligation"]
          updated_at?: string
        }
        Update: {
          base_calcul?: Json | null
          created_at?: string
          date_paiement?: string | null
          echeance?: string | null
          id?: string
          libelle?: string
          montant_du?: number | null
          montant_paye?: number
          notes?: string | null
          organisation_id?: string
          periode_debut?: string | null
          periode_fin?: string | null
          reference_paiement?: string | null
          statut?: Database["mine"]["Enums"]["statut_obligation"]
          titre_id?: string | null
          type_obligation?: Database["mine"]["Enums"]["type_obligation"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "obligations_titre_id_fkey"
            columns: ["titre_id"]
            isOneToOne: false
            referencedRelation: "titres"
            referencedColumns: ["id"]
          },
        ]
      }
      pointages_engins: {
        Row: {
          carburant_l: number
          compteur_fin: number | null
          created_at: string
          created_by: string | null
          date_pointage: string
          engin_id: string
          heures_marche: number
          heures_panne: number
          id: string
          observations: string | null
          operateur: string | null
          organisation_id: string
          poste: string
        }
        ComputedFields: never
        Insert: {
          carburant_l?: number
          compteur_fin?: number | null
          created_at?: string
          created_by?: string | null
          date_pointage: string
          engin_id: string
          heures_marche?: number
          heures_panne?: number
          id?: string
          observations?: string | null
          operateur?: string | null
          organisation_id: string
          poste?: string
        }
        Update: {
          carburant_l?: number
          compteur_fin?: number | null
          created_at?: string
          created_by?: string | null
          date_pointage?: string
          engin_id?: string
          heures_marche?: number
          heures_panne?: number
          id?: string
          observations?: string | null
          operateur?: string | null
          organisation_id?: string
          poste?: string
        }
        Relationships: [
          {
            foreignKeyName: "pointages_engins_engin_id_fkey"
            columns: ["engin_id"]
            isOneToOne: false
            referencedRelation: "engins"
            referencedColumns: ["id"]
          },
        ]
      }
      titres: {
        Row: {
          code: string
          created_at: string
          date_acte: string | null
          date_expiration: string | null
          date_notification: string | null
          id: string
          intitule: string
          localisation: string | null
          notes: string | null
          organisation_id: string
          perimetre_geojson: Json | null
          reference_acte: string | null
          statut: string
          substance: string
          superficie_km2: number | null
          type_titre: string
          updated_at: string
        }
        ComputedFields: never
        Insert: {
          code: string
          created_at?: string
          date_acte?: string | null
          date_expiration?: string | null
          date_notification?: string | null
          id?: string
          intitule: string
          localisation?: string | null
          notes?: string | null
          organisation_id: string
          perimetre_geojson?: Json | null
          reference_acte?: string | null
          statut?: string
          substance?: string
          superficie_km2?: number | null
          type_titre: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          date_acte?: string | null
          date_expiration?: string | null
          date_notification?: string | null
          id?: string
          intitule?: string
          localisation?: string | null
          notes?: string | null
          organisation_id?: string
          perimetre_geojson?: Json | null
          reference_acte?: string | null
          statut?: string
          substance?: string
          superficie_km2?: number | null
          type_titre?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_disponibilite_engins: {
        Row: {
          carburant_l: number | null
          code: string | null
          conso_l_par_h: number | null
          disponibilite_pct: number | null
          engin_id: string | null
          heures_marche: number | null
          heures_panne: number | null
          mois: string | null
          organisation_id: string | null
          type_engin: string | null
        }
        ComputedFields: never
        Relationships: [
          {
            foreignKeyName: "pointages_engins_engin_id_fkey"
            columns: ["engin_id"]
            isOneToOne: false
            referencedRelation: "engins"
            referencedColumns: ["id"]
          },
        ]
      }
      v_obligations_suivi: {
        Row: {
          alerte: string | null
          base_calcul: Json | null
          created_at: string | null
          date_paiement: string | null
          echeance: string | null
          id: string | null
          jours_de_retard: number | null
          libelle: string | null
          montant_du: number | null
          montant_paye: number | null
          notes: string | null
          organisation_id: string | null
          periode_debut: string | null
          periode_fin: string | null
          reference_paiement: string | null
          reste_a_payer: number | null
          statut: Database["mine"]["Enums"]["statut_obligation"] | null
          titre_code: string | null
          titre_id: string | null
          type_obligation: Database["mine"]["Enums"]["type_obligation"] | null
          updated_at: string | null
        }
        ComputedFields: never
        Relationships: [
          {
            foreignKeyName: "obligations_titre_id_fkey"
            columns: ["titre_id"]
            isOneToOne: false
            referencedRelation: "titres"
            referencedColumns: ["id"]
          },
        ]
      }
      v_production_mensuelle: {
        Row: {
          minerai_t: number | null
          mois: string | null
          organisation_id: string | null
          ratio_decouverture: number | null
          site_id: string | null
          sterile_t: number | null
        }
        ComputedFields: never
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      statut_obligation:
        | "a_venir"
        | "due"
        | "deposee"
        | "payee"
        | "partiellement_payee"
        | "contestee"
        | "moratoire"
        | "annulee"
      type_obligation:
        | "redevance_miniere"
        | "taxe_superficiaire"
        | "droits_fixes"
        | "rapport_trimestriel"
        | "rapport_annuel"
        | "eies"
        | "pges_suivi"
        | "plan_rehabilitation"
        | "declaration_production"
        | "autre"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  pilotage: {
    Tables: {
      indicateurs: {
        Row: {
          cible: number | null
          code: string
          id: string
          libelle: string
          organisation_id: string
          periodicite: string
          programme_id: string | null
          sens_favorable: string
          unite: string | null
        }
        ComputedFields: never
        Insert: {
          cible?: number | null
          code: string
          id?: string
          libelle: string
          organisation_id: string
          periodicite?: string
          programme_id?: string | null
          sens_favorable?: string
          unite?: string | null
        }
        Update: {
          cible?: number | null
          code?: string
          id?: string
          libelle?: string
          organisation_id?: string
          periodicite?: string
          programme_id?: string | null
          sens_favorable?: string
          unite?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "indicateurs_programme_id_fkey"
            columns: ["programme_id"]
            isOneToOne: false
            referencedRelation: "programmes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicateurs_programme_id_fkey"
            columns: ["programme_id"]
            isOneToOne: false
            referencedRelation: "v_avancement_programmes"
            referencedColumns: ["id"]
          },
        ]
      }
      jalons: {
        Row: {
          date_prevue: string
          date_reelle: string | null
          id: string
          livrable: string | null
          organisation_id: string
          programme_id: string
          statut: string
          titre: string
        }
        ComputedFields: never
        Insert: {
          date_prevue: string
          date_reelle?: string | null
          id?: string
          livrable?: string | null
          organisation_id: string
          programme_id: string
          statut?: string
          titre: string
        }
        Update: {
          date_prevue?: string
          date_reelle?: string | null
          id?: string
          livrable?: string | null
          organisation_id?: string
          programme_id?: string
          statut?: string
          titre?: string
        }
        Relationships: [
          {
            foreignKeyName: "jalons_programme_id_fkey"
            columns: ["programme_id"]
            isOneToOne: false
            referencedRelation: "programmes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jalons_programme_id_fkey"
            columns: ["programme_id"]
            isOneToOne: false
            referencedRelation: "v_avancement_programmes"
            referencedColumns: ["id"]
          },
        ]
      }
      mesures: {
        Row: {
          commentaire: string | null
          id: string
          indicateur_id: string
          organisation_id: string
          periode: string
          valeur: number
        }
        ComputedFields: never
        Insert: {
          commentaire?: string | null
          id?: string
          indicateur_id: string
          organisation_id: string
          periode: string
          valeur: number
        }
        Update: {
          commentaire?: string | null
          id?: string
          indicateur_id?: string
          organisation_id?: string
          periode?: string
          valeur?: number
        }
        Relationships: [
          {
            foreignKeyName: "mesures_indicateur_id_fkey"
            columns: ["indicateur_id"]
            isOneToOne: false
            referencedRelation: "indicateurs"
            referencedColumns: ["id"]
          },
        ]
      }
      programmes: {
        Row: {
          budget: number | null
          code: string
          created_at: string
          date_debut: string | null
          date_fin_prevue: string | null
          description: string | null
          id: string
          nom: string
          organisation_id: string
          responsable_id: string | null
          section_id: string | null
          statut: string
          updated_at: string
        }
        ComputedFields: never
        Insert: {
          budget?: number | null
          code: string
          created_at?: string
          date_debut?: string | null
          date_fin_prevue?: string | null
          description?: string | null
          id?: string
          nom: string
          organisation_id: string
          responsable_id?: string | null
          section_id?: string | null
          statut?: string
          updated_at?: string
        }
        Update: {
          budget?: number | null
          code?: string
          created_at?: string
          date_debut?: string | null
          date_fin_prevue?: string | null
          description?: string | null
          id?: string
          nom?: string
          organisation_id?: string
          responsable_id?: string | null
          section_id?: string | null
          statut?: string
          updated_at?: string
        }
        Relationships: []
      }
      risques: {
        Row: {
          categorie: string | null
          created_at: string
          criticite: number | null
          id: string
          impact: number
          organisation_id: string
          plan_attenuation: string | null
          probabilite: number
          programme_id: string
          proprietaire_id: string | null
          statut: string
          titre: string
        }
        ComputedFields: never
        Insert: {
          categorie?: string | null
          created_at?: string
          criticite?: never
          id?: string
          impact: number
          organisation_id: string
          plan_attenuation?: string | null
          probabilite: number
          programme_id: string
          proprietaire_id?: string | null
          statut?: string
          titre: string
        }
        Update: {
          categorie?: string | null
          created_at?: string
          criticite?: never
          id?: string
          impact?: number
          organisation_id?: string
          plan_attenuation?: string | null
          probabilite?: number
          programme_id?: string
          proprietaire_id?: string | null
          statut?: string
          titre?: string
        }
        Relationships: [
          {
            foreignKeyName: "risques_programme_id_fkey"
            columns: ["programme_id"]
            isOneToOne: false
            referencedRelation: "programmes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risques_programme_id_fkey"
            columns: ["programme_id"]
            isOneToOne: false
            referencedRelation: "v_avancement_programmes"
            referencedColumns: ["id"]
          },
        ]
      }
      taches: {
        Row: {
          avancement_pct: number
          created_at: string
          date_debut: string | null
          description: string | null
          echeance: string | null
          id: string
          jalon_id: string | null
          organisation_id: string
          parent_id: string | null
          priorite: number
          programme_id: string
          responsable_id: string | null
          statut: string
          titre: string
          updated_at: string
        }
        ComputedFields: never
        Insert: {
          avancement_pct?: number
          created_at?: string
          date_debut?: string | null
          description?: string | null
          echeance?: string | null
          id?: string
          jalon_id?: string | null
          organisation_id: string
          parent_id?: string | null
          priorite?: number
          programme_id: string
          responsable_id?: string | null
          statut?: string
          titre: string
          updated_at?: string
        }
        Update: {
          avancement_pct?: number
          created_at?: string
          date_debut?: string | null
          description?: string | null
          echeance?: string | null
          id?: string
          jalon_id?: string | null
          organisation_id?: string
          parent_id?: string | null
          priorite?: number
          programme_id?: string
          responsable_id?: string | null
          statut?: string
          titre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "taches_jalon_id_fkey"
            columns: ["jalon_id"]
            isOneToOne: false
            referencedRelation: "jalons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "taches_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "taches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "taches_programme_id_fkey"
            columns: ["programme_id"]
            isOneToOne: false
            referencedRelation: "programmes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "taches_programme_id_fkey"
            columns: ["programme_id"]
            isOneToOne: false
            referencedRelation: "v_avancement_programmes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_avancement_programmes: {
        Row: {
          avancement_moyen_pct: number | null
          code: string | null
          date_fin_prevue: string | null
          id: string | null
          nb_risques_critiques: number | null
          nb_taches: number | null
          nb_taches_en_retard: number | null
          nb_taches_terminees: number | null
          nom: string | null
          organisation_id: string | null
          prochain_jalon: string | null
          statut: string | null
        }
        ComputedFields: never
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  production: {
    Tables: {
      achats_site: {
        Row: {
          categorie: Database["production"]["Enums"]["categorie_achat"]
          comptabilise: boolean
          created_at: string
          created_by: string | null
          date_achat: string
          fournisseur: string | null
          id: string
          libelle: string
          mode_paiement: string | null
          montant: number | null
          notes: string | null
          organisation_id: string
          prix_unitaire: number
          project_id: string | null
          quantite: number
          reference_piece: string | null
          site_id: string
          unite: string | null
        }
        ComputedFields: never
        Insert: {
          categorie: Database["production"]["Enums"]["categorie_achat"]
          comptabilise?: boolean
          created_at?: string
          created_by?: string | null
          date_achat: string
          fournisseur?: string | null
          id?: string
          libelle: string
          mode_paiement?: string | null
          montant?: never
          notes?: string | null
          organisation_id: string
          prix_unitaire: number
          project_id?: string | null
          quantite?: number
          reference_piece?: string | null
          site_id: string
          unite?: string | null
        }
        Update: {
          categorie?: Database["production"]["Enums"]["categorie_achat"]
          comptabilise?: boolean
          created_at?: string
          created_by?: string | null
          date_achat?: string
          fournisseur?: string | null
          id?: string
          libelle?: string
          mode_paiement?: string | null
          montant?: never
          notes?: string | null
          organisation_id?: string
          prix_unitaire?: number
          project_id?: string | null
          quantite?: number
          reference_piece?: string | null
          site_id?: string
          unite?: string | null
        }
        Relationships: []
      }
      criblages: {
        Row: {
          carburant_l: number | null
          created_at: string
          created_by: string | null
          date_operation: string
          engin_id: string | null
          heures_marche: number | null
          id: string
          notes: string | null
          organisation_id: string
          poste: string
          site_id: string
          tonnage_crible: number
          tonnage_entree: number
          tonnage_refus: number
        }
        ComputedFields: never
        Insert: {
          carburant_l?: number | null
          created_at?: string
          created_by?: string | null
          date_operation: string
          engin_id?: string | null
          heures_marche?: number | null
          id?: string
          notes?: string | null
          organisation_id: string
          poste?: string
          site_id: string
          tonnage_crible: number
          tonnage_entree: number
          tonnage_refus?: number
        }
        Update: {
          carburant_l?: number | null
          created_at?: string
          created_by?: string | null
          date_operation?: string
          engin_id?: string | null
          heures_marche?: number | null
          id?: string
          notes?: string | null
          organisation_id?: string
          poste?: string
          site_id?: string
          tonnage_crible?: number
          tonnage_entree?: number
          tonnage_refus?: number
        }
        Relationships: []
      }
      produits: {
        Row: {
          code: string
          commercialisable: boolean
          libelle: string
          ordre: number
          unite: string
        }
        ComputedFields: never
        Insert: {
          code: string
          commercialisable?: boolean
          libelle: string
          ordre?: number
          unite?: string
        }
        Update: {
          code?: string
          commercialisable?: boolean
          libelle?: string
          ordre?: number
          unite?: string
        }
        Relationships: []
      }
      stock_mouvements: {
        Row: {
          created_at: string
          created_by: string | null
          date_mouvement: string
          id: string
          motif: Database["production"]["Enums"]["motif_mouvement"]
          note: string | null
          organisation_id: string
          produit_code: string
          quantite_t: number
          site_id: string
          source_id: string | null
          source_table: string | null
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          created_by?: string | null
          date_mouvement: string
          id?: string
          motif: Database["production"]["Enums"]["motif_mouvement"]
          note?: string | null
          organisation_id: string
          produit_code: string
          quantite_t: number
          site_id: string
          source_id?: string | null
          source_table?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date_mouvement?: string
          id?: string
          motif?: Database["production"]["Enums"]["motif_mouvement"]
          note?: string | null
          organisation_id?: string
          produit_code?: string
          quantite_t?: number
          site_id?: string
          source_id?: string | null
          source_table?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_mouvements_produit_code_fkey"
            columns: ["produit_code"]
            isOneToOne: false
            referencedRelation: "produits"
            referencedColumns: ["code"]
          },
        ]
      }
    }
    Views: {
      v_stock_journalier: {
        Row: {
          date_mouvement: string | null
          entrees_t: number | null
          organisation_id: string | null
          produit_code: string | null
          site_id: string | null
          sorties_t: number | null
          stock_fin_t: number | null
        }
        ComputedFields: never
        Relationships: [
          {
            foreignKeyName: "stock_mouvements_produit_code_fkey"
            columns: ["produit_code"]
            isOneToOne: false
            referencedRelation: "produits"
            referencedColumns: ["code"]
          },
        ]
      }
      v_stocks: {
        Row: {
          dernier_mouvement: string | null
          organisation_id: string | null
          produit_code: string | null
          produit_libelle: string | null
          site_id: string | null
          site_nom: string | null
          stock_t: number | null
        }
        ComputedFields: never
        Relationships: [
          {
            foreignKeyName: "stock_mouvements_produit_code_fkey"
            columns: ["produit_code"]
            isOneToOne: false
            referencedRelation: "produits"
            referencedColumns: ["code"]
          },
        ]
      }
    }
    Functions: {
      ecrire_mouvements: {
        Args: {
          p_date: string
          p_lignes: Json
          p_motif: Database["production"]["Enums"]["motif_mouvement"]
          p_org: string
          p_site: string
          p_source_id: string
          p_source_table: string
        }
        Returns: undefined
      }
    }
    Enums: {
      categorie_achat:
        | "INTRANTS"
        | "CARBURANT_SITE"
        | "MAINTENANCE"
        | "RESTAURATION"
        | "MAIN_OEUVRE"
        | "LOCATION_ENGINS"
        | "DIVERS"
      motif_mouvement:
        | "extraction"
        | "criblage"
        | "ensachage"
        | "livraison"
        | "transfert"
        | "ajustement_inventaire"
        | "perte"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_categories_depense: {
        Row: {
          id_categorie: string
          nom_categorie: string
        }
        ComputedFields: never
        Insert: {
          id_categorie?: string
          nom_categorie: string
        }
        Update: {
          id_categorie?: string
          nom_categorie?: string
        }
        Relationships: []
      }
      admin_codes_analytiques: {
        Row: {
          code: string | null
          description: string | null
          id_code: string
        }
        ComputedFields: never
        Insert: {
          code?: string | null
          description?: string | null
          id_code?: string
        }
        Update: {
          code?: string | null
          description?: string | null
          id_code?: string
        }
        Relationships: []
      }
      admin_depenses: {
        Row: {
          created_at: string
          date_operation: string
          depense_en_attente: boolean | null
          id_categorie: string | null
          id_code_analytique: string | null
          id_depense: string
          id_mode_paiement: string | null
          id_responsable: string | null
          id_user: string | null
          libelle: string
          montant: number
          reference_piece: string | null
          updated_at: string
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          date_operation: string
          depense_en_attente?: boolean | null
          id_categorie?: string | null
          id_code_analytique?: string | null
          id_depense?: string
          id_mode_paiement?: string | null
          id_responsable?: string | null
          id_user?: string | null
          libelle: string
          montant: number
          reference_piece?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_operation?: string
          depense_en_attente?: boolean | null
          id_categorie?: string | null
          id_code_analytique?: string | null
          id_depense?: string
          id_mode_paiement?: string | null
          id_responsable?: string | null
          id_user?: string | null
          libelle?: string
          montant?: number
          reference_piece?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_depenses_id_categorie_fkey"
            columns: ["id_categorie"]
            isOneToOne: false
            referencedRelation: "admin_categories_depense"
            referencedColumns: ["id_categorie"]
          },
          {
            foreignKeyName: "admin_depenses_id_code_analytique_fkey"
            columns: ["id_code_analytique"]
            isOneToOne: false
            referencedRelation: "admin_codes_analytiques"
            referencedColumns: ["id_code"]
          },
          {
            foreignKeyName: "admin_depenses_id_mode_paiement_fkey"
            columns: ["id_mode_paiement"]
            isOneToOne: false
            referencedRelation: "admin_modes_paiement"
            referencedColumns: ["id_mode"]
          },
          {
            foreignKeyName: "admin_depenses_id_responsable_fkey"
            columns: ["id_responsable"]
            isOneToOne: false
            referencedRelation: "admin_personnel"
            referencedColumns: ["id_personnel"]
          },
          {
            foreignKeyName: "fk_admin_depenses_user_preferences"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "user_preferences"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_modes_paiement: {
        Row: {
          id_mode: string
          nom_mode: string
        }
        ComputedFields: never
        Insert: {
          id_mode?: string
          nom_mode: string
        }
        Update: {
          id_mode?: string
          nom_mode?: string
        }
        Relationships: []
      }
      admin_personnel: {
        Row: {
          id_personnel: string
          id_poste: string | null
          nom: string
          prenom: string | null
          telephone: string | null
          user_preference_id: string | null
        }
        ComputedFields: never
        Insert: {
          id_personnel?: string
          id_poste?: string | null
          nom: string
          prenom?: string | null
          telephone?: string | null
          user_preference_id?: string | null
        }
        Update: {
          id_personnel?: string
          id_poste?: string | null
          nom?: string
          prenom?: string | null
          telephone?: string | null
          user_preference_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_personnel_id_poste_fkey"
            columns: ["id_poste"]
            isOneToOne: false
            referencedRelation: "admin_postes"
            referencedColumns: ["id_poste"]
          },
          {
            foreignKeyName: "admin_personnel_user_preference_id_fkey"
            columns: ["user_preference_id"]
            isOneToOne: false
            referencedRelation: "user_preferences"
            referencedColumns: ["user_id"]
          },
        ]
      }
      admin_postes: {
        Row: {
          categorie_poste: string | null
          id_poste: string
          titre_poste: string
        }
        ComputedFields: never
        Insert: {
          categorie_poste?: string | null
          id_poste?: string
          titre_poste: string
        }
        Update: {
          categorie_poste?: string | null
          id_poste?: string
          titre_poste?: string
        }
        Relationships: []
      }
      allocations: {
        Row: {
          allocation_key: string
          commune_id: string
          created_at: string | null
          department_id: string
          id: string
          operator_id: string
          project_id: string | null
          region_id: string
          responsible_name: string
          responsible_phone_normalized: string | null
          responsible_phone_raw: string | null
          status: Database["public"]["Enums"]["allocation_status"] | null
          target_tonnage: number
          updated_at: string | null
        }
        ComputedFields: never
        Insert: {
          allocation_key: string
          commune_id: string
          created_at?: string | null
          department_id: string
          id?: string
          operator_id: string
          project_id?: string | null
          region_id: string
          responsible_name: string
          responsible_phone_normalized?: string | null
          responsible_phone_raw?: string | null
          status?: Database["public"]["Enums"]["allocation_status"] | null
          target_tonnage: number
          updated_at?: string | null
        }
        Update: {
          allocation_key?: string
          commune_id?: string
          created_at?: string | null
          department_id?: string
          id?: string
          operator_id?: string
          project_id?: string | null
          region_id?: string
          responsible_name?: string
          responsible_phone_normalized?: string | null
          responsible_phone_raw?: string | null
          status?: Database["public"]["Enums"]["allocation_status"] | null
          target_tonnage?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "allocations_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "communes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allocations_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allocations_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allocations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allocations_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      bl_counter: {
        Row: {
          last_number: number
          year: number
        }
        ComputedFields: never
        Insert: {
          last_number?: number
          year: number
        }
        Update: {
          last_number?: number
          year?: number
        }
        Relationships: []
      }
      communes: {
        Row: {
          code: string
          created_at: string | null
          department_id: string
          distance_mine: number | null
          id: string
          name: string
        }
        ComputedFields: never
        Insert: {
          code: string
          created_at?: string | null
          department_id: string
          distance_mine?: number | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          department_id?: string
          distance_mine?: number | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "communes_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      deliveries: {
        Row: {
          allocation_id: string
          bl_number: string | null
          created_at: string | null
          created_by: string | null
          declaration_code: string | null
          delivery_date: string | null
          driver_id: string | null
          id: string
          payments_id: string | null
          tonnage_loaded: number
          truck_id: string | null
          updated_at: string | null
        }
        ComputedFields: never
        Insert: {
          allocation_id: string
          bl_number?: string | null
          created_at?: string | null
          created_by?: string | null
          declaration_code?: string | null
          delivery_date?: string | null
          driver_id?: string | null
          id?: string
          payments_id?: string | null
          tonnage_loaded: number
          truck_id?: string | null
          updated_at?: string | null
        }
        Update: {
          allocation_id?: string
          bl_number?: string | null
          created_at?: string | null
          created_by?: string | null
          declaration_code?: string | null
          delivery_date?: string | null
          driver_id?: string | null
          id?: string
          payments_id?: string | null
          tonnage_loaded?: number
          truck_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_allocation_id_fkey"
            columns: ["allocation_id"]
            isOneToOne: false
            referencedRelation: "allocations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_payments_id_fkey"
            columns: ["payments_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
          region_id: string
        }
        ComputedFields: never
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
          region_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          region_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          created_at: string | null
          id: string
          license_number: string | null
          name: string
          phone_normalized: string | null
          status: string | null
          truck_id: string | null
        }
        ComputedFields: never
        Insert: {
          created_at?: string | null
          id?: string
          license_number?: string | null
          name: string
          phone_normalized?: string | null
          status?: string | null
          truck_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          license_number?: string | null
          name?: string
          phone_normalized?: string | null
          status?: string | null
          truck_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_types: {
        Row: {
          code: string
          created_at: string
          default_frequency_days: number | null
          description: string | null
          icon_name: string | null
          id: string
          is_regulatory_subject: boolean
          label: string
        }
        ComputedFields: never
        Insert: {
          code: string
          created_at?: string
          default_frequency_days?: number | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_regulatory_subject?: boolean
          label: string
        }
        Update: {
          code?: string
          created_at?: string
          default_frequency_days?: number | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_regulatory_subject?: boolean
          label?: string
        }
        Relationships: []
      }
      equipments: {
        Row: {
          Affectation_equipements: string | null
          category: string | null
          commissioning_date: string | null
          created_at: string
          id: string
          location: string | null
          name: string
          quantite_dispo: number | null
          ref_code: string
          responsible_user_id: string | null
          serial_number: string | null
          status: string
          type_id: string | null
        }
        ComputedFields: never
        Insert: {
          Affectation_equipements?: string | null
          category?: string | null
          commissioning_date?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name: string
          quantite_dispo?: number | null
          ref_code: string
          responsible_user_id?: string | null
          serial_number?: string | null
          status?: string
          type_id?: string | null
        }
        Update: {
          Affectation_equipements?: string | null
          category?: string | null
          commissioning_date?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          quantite_dispo?: number | null
          ref_code?: string
          responsible_user_id?: string | null
          serial_number?: string | null
          status?: string
          type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_equipments_responsible_user"
            columns: ["responsible_user_id"]
            isOneToOne: false
            referencedRelation: "admin_personnel"
            referencedColumns: ["id_personnel"]
          },
          {
            foreignKeyName: "fk_equipments_type_id"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "equipment_types"
            referencedColumns: ["id"]
          },
        ]
      }
      hqse_corrective_actions: {
        Row: {
          action_plan: string
          assigned_to: string | null
          completion_date: string | null
          id: string
          nc_id: string | null
          status: string
          target_date: string | null
        }
        ComputedFields: never
        Insert: {
          action_plan: string
          assigned_to?: string | null
          completion_date?: string | null
          id?: string
          nc_id?: string | null
          status?: string
          target_date?: string | null
        }
        Update: {
          action_plan?: string
          assigned_to?: string | null
          completion_date?: string | null
          id?: string
          nc_id?: string | null
          status?: string
          target_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_corrective_actions_assigned_to"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "admin_personnel"
            referencedColumns: ["id_personnel"]
          },
          {
            foreignKeyName: "hqse_corrective_actions_nc_id_fkey"
            columns: ["nc_id"]
            isOneToOne: false
            referencedRelation: "hqse_non_conformities"
            referencedColumns: ["id"]
          },
        ]
      }
      hqse_employee_allocations: {
        Row: {
          allocation_date: string
          comments: string | null
          condition_at_allocation: string | null
          created_at: string
          employee_id: string
          equipment_id: string
          expected_renewal_date: string | null
          id: string
          is_returned: boolean | null
          quantity_allocated: number
          return_date: string | null
        }
        ComputedFields: never
        Insert: {
          allocation_date?: string
          comments?: string | null
          condition_at_allocation?: string | null
          created_at?: string
          employee_id: string
          equipment_id: string
          expected_renewal_date?: string | null
          id?: string
          is_returned?: boolean | null
          quantity_allocated?: number
          return_date?: string | null
        }
        Update: {
          allocation_date?: string
          comments?: string | null
          condition_at_allocation?: string | null
          created_at?: string
          employee_id?: string
          equipment_id?: string
          expected_renewal_date?: string | null
          id?: string
          is_returned?: boolean | null
          quantity_allocated?: number
          return_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_allocation_employee"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "admin_personnel"
            referencedColumns: ["id_personnel"]
          },
          {
            foreignKeyName: "hqse_employee_allocations_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipments"
            referencedColumns: ["id"]
          },
        ]
      }
      hqse_inspection_plans: {
        Row: {
          equipment_id: string | null
          frequency_days: number
          id: string
          inspection_type: string
          last_inspection_date: string | null
          next_due_date: string | null
        }
        ComputedFields: never
        Insert: {
          equipment_id?: string | null
          frequency_days: number
          id?: string
          inspection_type: string
          last_inspection_date?: string | null
          next_due_date?: string | null
        }
        Update: {
          equipment_id?: string | null
          frequency_days?: number
          id?: string
          inspection_type?: string
          last_inspection_date?: string | null
          next_due_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hqse_inspection_plans_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipments"
            referencedColumns: ["id"]
          },
        ]
      }
      hqse_inspections: {
        Row: {
          comments: string | null
          created_at: string
          equipment_id: string | null
          id: string
          id_employe: string | null
          inspection_date: string
          inspector_name: string | null
          report: string | null
          verdict: string | null
        }
        ComputedFields: never
        Insert: {
          comments?: string | null
          created_at?: string
          equipment_id?: string | null
          id?: string
          id_employe?: string | null
          inspection_date: string
          inspector_name?: string | null
          report?: string | null
          verdict?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string
          equipment_id?: string | null
          id?: string
          id_employe?: string | null
          inspection_date?: string
          inspector_name?: string | null
          report?: string | null
          verdict?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hqse_inspections_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hqse_inspections_id_employe_fkey"
            columns: ["id_employe"]
            isOneToOne: false
            referencedRelation: "admin_personnel"
            referencedColumns: ["id_personnel"]
          },
        ]
      }
      hqse_non_conformities: {
        Row: {
          declared_at: string
          description: string
          equipment_id: string | null
          id: string
          inspection_id: string | null
          severity: string | null
          status: string
        }
        ComputedFields: never
        Insert: {
          declared_at?: string
          description: string
          equipment_id?: string | null
          id?: string
          inspection_id?: string | null
          severity?: string | null
          status?: string
        }
        Update: {
          declared_at?: string
          description?: string
          equipment_id?: string | null
          id?: string
          inspection_id?: string | null
          severity?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "hqse_non_conformities_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hqse_non_conformities_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "hqse_inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      hqse_safety_compliance_audits: {
        Row: {
          audit_date: string
          auditor_id: string
          corrective_action_required: string | null
          created_at: string
          employee_id: string
          equipment_id: string | null
          has_deteriorated_equipment: boolean
          has_loss_occurred: boolean
          id: string
          is_usage_respected: boolean
          number_of_items: number
          observation_notes: string | null
          sanction_type: string | null
        }
        ComputedFields: never
        Insert: {
          audit_date?: string
          auditor_id: string
          corrective_action_required?: string | null
          created_at?: string
          employee_id: string
          equipment_id?: string | null
          has_deteriorated_equipment?: boolean
          has_loss_occurred?: boolean
          id?: string
          is_usage_respected?: boolean
          number_of_items?: number
          observation_notes?: string | null
          sanction_type?: string | null
        }
        Update: {
          audit_date?: string
          auditor_id?: string
          corrective_action_required?: string | null
          created_at?: string
          employee_id?: string
          equipment_id?: string | null
          has_deteriorated_equipment?: boolean
          has_loss_occurred?: boolean
          id?: string
          is_usage_respected?: boolean
          number_of_items?: number
          observation_notes?: string | null
          sanction_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hqse_safety_compliance_audits_auditor_id_fkey"
            columns: ["auditor_id"]
            isOneToOne: false
            referencedRelation: "user_preferences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hqse_safety_compliance_audits_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "admin_personnel"
            referencedColumns: ["id_personnel"]
          },
          {
            foreignKeyName: "hqse_safety_compliance_audits_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipments"
            referencedColumns: ["id"]
          },
        ]
      }
      hqse_tickets_signalements: {
        Row: {
          created_at: string
          employee_concerned_id: string | null
          equipment_id: string | null
          event_date: string
          id: string
          measures_to_take: string | null
          origin: Database["public"]["Enums"]["hqse_origin_type"]
          reason_description: string
          register: Database["public"]["Enums"]["hqse_register_type"]
          reported_by: string
          severity: Database["public"]["Enums"]["hqse_severity_level"]
          status: string
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          employee_concerned_id?: string | null
          equipment_id?: string | null
          event_date?: string
          id?: string
          measures_to_take?: string | null
          origin: Database["public"]["Enums"]["hqse_origin_type"]
          reason_description: string
          register: Database["public"]["Enums"]["hqse_register_type"]
          reported_by: string
          severity?: Database["public"]["Enums"]["hqse_severity_level"]
          status?: string
        }
        Update: {
          created_at?: string
          employee_concerned_id?: string | null
          equipment_id?: string | null
          event_date?: string
          id?: string
          measures_to_take?: string | null
          origin?: Database["public"]["Enums"]["hqse_origin_type"]
          reason_description?: string
          register?: Database["public"]["Enums"]["hqse_register_type"]
          reported_by?: string
          severity?: Database["public"]["Enums"]["hqse_severity_level"]
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "hqse_tickets_signalements_employee_concerned_id_fkey"
            columns: ["employee_concerned_id"]
            isOneToOne: false
            referencedRelation: "admin_personnel"
            referencedColumns: ["id_personnel"]
          },
          {
            foreignKeyName: "hqse_tickets_signalements_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hqse_tickets_signalements_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "user_preferences"
            referencedColumns: ["id"]
          },
        ]
      }
      operators: {
        Row: {
          commune_id: string | null
          contact_info: string | null
          coop_name: string | null
          created_at: string | null
          id: string
          name: string
          operateur_coop_gie: boolean | null
          projet_id: string | null
        }
        ComputedFields: never
        Insert: {
          commune_id?: string | null
          contact_info?: string | null
          coop_name?: string | null
          created_at?: string | null
          id?: string
          name: string
          operateur_coop_gie?: boolean | null
          projet_id?: string | null
        }
        Update: {
          commune_id?: string | null
          contact_info?: string | null
          coop_name?: string | null
          created_at?: string | null
          id?: string
          name?: string
          operateur_coop_gie?: boolean | null
          projet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operators_commune_id_fkey"
            columns: ["commune_id"]
            isOneToOne: false
            referencedRelation: "communes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operators_projet_id_fkey"
            columns: ["projet_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          created_at: string | null
          date_updated: string | null
          delivery_id: string
          fuel_cost: number | null
          fuel_quantity: number | null
          id: string
          loading_cost: number | null
          other_fees: number | null
          other_fees_label: string | null
          overweigh_fees: number | null
          personal_fees: number | null
          road_fees: number | null
          truck_id: string
          unloading_cost: number | null
        }
        ComputedFields: never
        Insert: {
          created_at?: string | null
          date_updated?: string | null
          delivery_id: string
          fuel_cost?: number | null
          fuel_quantity?: number | null
          id?: string
          loading_cost?: number | null
          other_fees?: number | null
          other_fees_label?: string | null
          overweigh_fees?: number | null
          personal_fees?: number | null
          road_fees?: number | null
          truck_id: string
          unloading_cost?: number | null
        }
        Update: {
          created_at?: string | null
          date_updated?: string | null
          delivery_id?: string
          fuel_cost?: number | null
          fuel_quantity?: number | null
          id?: string
          loading_cost?: number | null
          other_fees?: number | null
          other_fees_label?: string | null
          overweigh_fees?: number | null
          personal_fees?: number | null
          road_fees?: number | null
          truck_id?: string
          unloading_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      production: {
        Row: {
          bags_deployed: number
          bags_filled_50kg: number
          created_at: string
          equipe_couture: number | null
          id: string
          is_accounted: boolean | null
          nombre_elements: number | null
          notes: string | null
          production_date: string
          project_id: string
          tonnage: number | null
          total_amount: number | null
          updated_at: string
        }
        ComputedFields: never
        Insert: {
          bags_deployed: number
          bags_filled_50kg: number
          created_at?: string
          equipe_couture?: number | null
          id?: string
          is_accounted?: boolean | null
          nombre_elements?: number | null
          notes?: string | null
          production_date?: string
          project_id: string
          tonnage?: number | null
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          bags_deployed?: number
          bags_filled_50kg?: number
          created_at?: string
          equipe_couture?: number | null
          id?: string
          is_accounted?: boolean | null
          nombre_elements?: number | null
          notes?: string | null
          production_date?: string
          project_id?: string
          tonnage?: number | null
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
        ]
      }
      project: {
        Row: {
          date_mise_disposition: string | null
          export_statut: boolean | null
          id: string
          numero_bon_disposition: string | null
          numero_marche: string | null
          numero_phase: number | null
          project_description: string | null
          project_visibility: boolean | null
          tonnage_total: number | null
        }
        ComputedFields: never
        Insert: {
          date_mise_disposition?: string | null
          export_statut?: boolean | null
          id?: string
          numero_bon_disposition?: string | null
          numero_marche?: string | null
          numero_phase?: number | null
          project_description?: string | null
          project_visibility?: boolean | null
          tonnage_total?: number | null
        }
        Update: {
          date_mise_disposition?: string | null
          export_statut?: boolean | null
          id?: string
          numero_bon_disposition?: string | null
          numero_marche?: string | null
          numero_phase?: number | null
          project_description?: string | null
          project_visibility?: boolean | null
          tonnage_total?: number | null
        }
        Relationships: []
      }
      regions: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
        }
        ComputedFields: never
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      trucks: {
        Row: {
          capacity_tonnes: number | null
          chassis_camion: string | null
          created_at: string | null
          id: string
          owner_type: boolean
          plate_number: string
          qrcode_content: string | null
          status: string | null
          trailer_number: string | null
          truck_marque: string | null
          truck_type: string | null
          Trucks_proprietaire: string | null
          updated_at: string | null
        }
        ComputedFields: never
        Insert: {
          capacity_tonnes?: number | null
          chassis_camion?: string | null
          created_at?: string | null
          id?: string
          owner_type?: boolean
          plate_number: string
          qrcode_content?: string | null
          status?: string | null
          trailer_number?: string | null
          truck_marque?: string | null
          truck_type?: string | null
          Trucks_proprietaire?: string | null
          updated_at?: string | null
        }
        Update: {
          capacity_tonnes?: number | null
          chassis_camion?: string | null
          created_at?: string | null
          id?: string
          owner_type?: boolean
          plate_number?: string
          qrcode_content?: string | null
          status?: string | null
          trailer_number?: string | null
          truck_marque?: string | null
          truck_type?: string | null
          Trucks_proprietaire?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          language: string
          sidebar_pinned: boolean
          theme_color: string
          theme_mode: string
          theme_name: string
          updated_at: string
          user_email: string | null
          user_id: string
          user_pswd: string | null
          user_right_level: number | null
          user_statut: boolean | null
        }
        ComputedFields: never
        Insert: {
          created_at?: string
          id?: string
          language?: string
          sidebar_pinned?: boolean
          theme_color?: string
          theme_mode?: string
          theme_name?: string
          updated_at?: string
          user_email?: string | null
          user_id: string
          user_pswd?: string | null
          user_right_level?: number | null
          user_statut?: boolean | null
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          sidebar_pinned?: boolean
          theme_color?: string
          theme_mode?: string
          theme_name?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string
          user_pswd?: string | null
          user_right_level?: number | null
          user_statut?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      view_bon_livraison: {
        Row: {
          allocation_key: string | null
          bl_number: string | null
          commune: string | null
          delivery_date: string | null
          department: string | null
          driver_name: string | null
          numero_phase: number | null
          operator_contact_info: string | null
          operator_coop_name: string | null
          operator_name: string | null
          project_num_bon: string | null
          region: string | null
          target_tonnage: number | null
          tonnage_loaded: number | null
          truck_plate_number: string | null
          truck_trailer_number: string | null
        }
        ComputedFields: never
        Relationships: []
      }
      view_fin_de_cession: {
        Row: {
          commune: string | null
          deliveries_count: number | null
          department: string | null
          operator_contact_info: string | null
          operator_coop_name: string | null
          operator_name: string | null
          project_phase: number | null
          region: string | null
          total_tonnage: number | null
        }
        ComputedFields: never
        Relationships: []
      }
    }
    Functions: {
      generate_bl_number_text: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      normalize_phone_number: { Args: { phone: string }; Returns: string }
      recalc_allocation_status_for_id: {
        Args: { allocation_uuid: string }
        Returns: undefined
      }
      tonnes_to_bags: { Args: { tonnes: number }; Returns: number }
    }
    Enums: {
      allocation_status:
        | "OPEN"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "CLOSED"
        | "OVER_DELIVERED"
      app_role: "admin" | "dispatcher" | "field_agent" | "auditor"
      delivery_status: "DRAFT" | "SYNCED" | "VERIFIED" | "INVOICED" | "REJECTED"
      hqse_origin_type: "materiel" | "humain" | "organisationnel" | "externe"
      hqse_register_type:
        | "accident"
        | "sante"
        | "danger"
        | "qualite"
        | "environnement"
      hqse_severity_level: "Mineure" | "Majeure" | "Critique"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  core: {
    Enums: {
      role_app: [
        "admin",
        "direction",
        "finance",
        "comptable",
        "logistique",
        "chef_site",
        "mine",
        "hqse",
        "rh",
        "chauffeur",
        "lecteur",
      ],
    },
  },
  finance: {
    Enums: {},
  },
  livraisons: {
    Enums: {},
  },
  mine: {
    Enums: {
      statut_obligation: [
        "a_venir",
        "due",
        "deposee",
        "payee",
        "partiellement_payee",
        "contestee",
        "moratoire",
        "annulee",
      ],
      type_obligation: [
        "redevance_miniere",
        "taxe_superficiaire",
        "droits_fixes",
        "rapport_trimestriel",
        "rapport_annuel",
        "eies",
        "pges_suivi",
        "plan_rehabilitation",
        "declaration_production",
        "autre",
      ],
    },
  },
  pilotage: {
    Enums: {},
  },
  production: {
    Enums: {
      categorie_achat: [
        "INTRANTS",
        "CARBURANT_SITE",
        "MAINTENANCE",
        "RESTAURATION",
        "MAIN_OEUVRE",
        "LOCATION_ENGINS",
        "DIVERS",
      ],
      motif_mouvement: [
        "extraction",
        "criblage",
        "ensachage",
        "livraison",
        "transfert",
        "ajustement_inventaire",
        "perte",
      ],
    },
  },
  public: {
    Enums: {
      allocation_status: [
        "OPEN",
        "IN_PROGRESS",
        "COMPLETED",
        "CLOSED",
        "OVER_DELIVERED",
      ],
      app_role: ["admin", "dispatcher", "field_agent", "auditor"],
      delivery_status: ["DRAFT", "SYNCED", "VERIFIED", "INVOICED", "REJECTED"],
      hqse_origin_type: ["materiel", "humain", "organisationnel", "externe"],
      hqse_register_type: [
        "accident",
        "sante",
        "danger",
        "qualite",
        "environnement",
      ],
      hqse_severity_level: ["Mineure", "Majeure", "Critique"],
    },
  },
} as const
