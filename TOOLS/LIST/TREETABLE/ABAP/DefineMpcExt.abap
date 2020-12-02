  METHOD define.

    DATA: lo_annotation   TYPE REF TO /iwbep/if_mgw_odata_annotation,
          lo_entity_type  TYPE REF TO /iwbep/if_mgw_odata_entity_typ,
          lo_complex_type TYPE REF TO /iwbep/if_mgw_odata_cmplx_type,
          lo_property     TYPE REF TO /iwbep/if_mgw_odata_property,
          lo_entity_set   TYPE REF TO /iwbep/if_mgw_odata_entity_set.

    super->define( ).

    lo_entity_type = model->get_entity_type( iv_entity_name = 'HUsingDecisionTree' ). " Tree Table Set Name => HUsingDecisionTree
    lo_property = lo_entity_type->get_property( iv_property_name = 'Node' ).
    lo_annotation = lo_property->/iwbep/if_mgw_odata_annotatabl~create_annotation( iv_annotation_namespace =  /iwbep/if_mgw_med_odata_types=>gc_sap_namespace ).
    lo_annotation->add(
        iv_key      = /iwbep/if_ana_odata_types=>gcs_ana_odata_annotation_key-hierarchy_node_for
        iv_value    = 'Node' ).

    lo_property = lo_entity_type->get_property( iv_property_name = 'Level' ).
    lo_annotation = lo_property->/iwbep/if_mgw_odata_annotatabl~create_annotation( iv_annotation_namespace =  /iwbep/if_mgw_med_odata_types=>gc_sap_namespace ).
    lo_annotation->add(
        iv_key      = /iwbep/if_ana_odata_types=>gcs_ana_odata_annotation_key-hierarchy_level_for
        iv_value    = 'Node' ).

    lo_property = lo_entity_type->get_property( iv_property_name = 'Parent' ).
    lo_annotation = lo_property->/iwbep/if_mgw_odata_annotatabl~create_annotation( iv_annotation_namespace =  /iwbep/if_mgw_med_odata_types=>gc_sap_namespace ).
    lo_annotation->add(
        iv_key      = /iwbep/if_ana_odata_types=>gcs_ana_odata_annotation_key-hierarchy_parent_node_for
        iv_value    = 'Node' ).

    lo_property = lo_entity_type->get_property( iv_property_name = 'Drill' ).
    lo_annotation = lo_property->/iwbep/if_mgw_odata_annotatabl~create_annotation( iv_annotation_namespace =  /iwbep/if_mgw_med_odata_types=>gc_sap_namespace ).
    lo_annotation->add(
        iv_key      = /iwbep/if_ana_odata_types=>gcs_ana_odata_annotation_key-hierarchy_drill_state_for
        iv_value    = 'Node' ).

  ENDMETHOD.