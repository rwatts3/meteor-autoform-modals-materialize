var collectionObj, helpers, registeredAutoFormHooks;

registeredAutoFormHooks = ['cmForm'];

AutoForm.addHooks('cmForm', {
  onSuccess: function() {
    $('#afModal').closeModal({ dismissible: true, complete: function() { $('.lean-overlay').remove() }});
  }
});

collectionObj = function(name) {
  return name.split('.').reduce(function(o, x) {
    return o[x];
  }, window);
};

Template.autoformModals.events({
  'click button:not(.close)': function() {
    var _id, collection, operation;
    collection = Session.get('cmCollection');
    operation = Session.get('cmOperation');
    if (operation !== 'insert') {
      _id = Session.get('cmDoc')._id;
    }
    if (operation === 'remove') {
      collectionObj(collection).remove(_id, function(e) {
        if (e) {
          return alert('Sorry, this could not be deleted.');
        } else {
          return $('#afModal').closeModal({ dismissible: true, complete: function() { $('.lean-overlay').remove() }});
        }
      });
    }
  },
  'click [data-action="submit"]': function(event, template) {
    event.preventDefault();
    template.$('form').submit();
  },
  'click [data-action="cancel"]': function(event, template) {
    event.preventDefault();
    $('#afModal').closeModal({ dismissible: true, complete: function() { $('.lean-overlay').remove() }});
  }
});

helpers = {
  cmFormId: function() {
    return Session.get('cmFormId');
  },
  cmCollection: function() {
    return Session.get('cmCollection');
  },
  cmSchema: function() {
    return Session.get('cmSchema');
  },
  cmOperation: function() {
    return Session.get('cmOperation');
  },
  cmDoc: function() {
    return Session.get('cmDoc');
  },
  cmButtonHtml: function() {
    return Session.get('cmButtonHtml');
  },
  cmFields: function() {
    return Session.get('cmFields');
  },
  cmOmitFields: function() {
    return Session.get('cmOmitFields');
  },
  cmButtonContent: function() {
    return Session.get('cmButtonContent');
  },
  cmButtonCancelContent: function() {
    return Session.get('cmButtonCancelContent');
  },
  cmTitle: function() {
    return Session.get('cmTitle');
  },
  cmButtonClasses: function() {
    return Session.get('cmButtonClasses');
  },
  cmButtonSubmitClasses: function() {
    return Session.get('cmButtonSubmitClasses');
  },
  cmButtonCancelClasses: function() {
    return Session.get('cmButtonCancelClasses');
  },
  cmPrompt: function() {
    return Session.get('cmPrompt');
  },
  cmTemplate: function() {
    return Session.get('cmTemplate');
  },
  cmLabelClass: function() {
    return Session.get('cmLabelClass');
  },
  cmInputColClass: function() {
    return Session.get('cmInputColClass');
  },
  cmPlaceholder: function() {
    return Session.get('cmPlaceholder');
  },
  cmFormId: function() {
    return Session.get('cmFormId') || 'cmForm';
  },
  title: function() {
    return StringTemplate.compile('{{{cmTitle}}}', helpers);
  },
  prompt: function() {
    return StringTemplate.compile('{{{cmPrompt}}}', helpers);
  }
};

Template.autoformModals.helpers(helpers);

Template.autoformModals.destroyed = function() {
  return $('body').unbind('click');
};

Template.afModal.events({
  'click *': function(e, t) {
    var defaultButtonClasses, formId, html;
    e.preventDefault();
    html = t.$('*').html();
    formId = t.data.formId || "cmForm";
    Session.set('cmFormId', formId);
    Session.set('cmCollection', t.data.collection);
    Session.set('cmSchema', t.data.schema);
    Session.set('cmOperation', t.data.operation);
    Session.set('cmFields', t.data.fields);
    Session.set('cmOmitFields', t.data.omitFields);
    Session.set('cmButtonHtml', html);
    Session.set('cmTitle', t.data.title || html);
    Session.set('cmTemplate', t.data.template);
    Session.set('cmLabelClass', t.data.labelClass);
    Session.set('cmInputColClass', t.data.inputColClass);
    Session.set('cmPlaceholder', t.data.placeholder === true ? 'schemaLabel' : '');
    if (!_.contains(registeredAutoFormHooks, formId)) {
      AutoForm.addHooks(formId, {
        onSuccess: function() {
          $('#afModal').closeModal({ dismissible: true, complete: function() { $('.lean-overlay').remove() }});
        }
      });
      registeredAutoFormHooks.push(formId);
    }
    if (t.data.doc && typeof t.data.doc === 'string') {
      Session.set('cmDoc', collectionObj(t.data.collection).findOne({
        _id: t.data.doc
      }));
    }
    if (t.data.buttonContent) {
      Session.set('cmButtonContent', t.data.buttonContent);
    } else if (t.data.operation === 'insert') {
      Session.set('cmButtonContent', 'Create');
    } else if (t.data.operation === 'update') {
      Session.set('cmButtonContent', 'Update');
    } else if (t.data.operation === 'remove') {
      Session.set('cmButtonContent', 'Delete');
    }
    if (t.data.buttonCancelContent) {
      Session.set('cmButtonCancelContent', t.data.buttonCancelContent);
    } else {
      Session.set('cmButtonCancelContent', 'Cancel');
    }
    defaultButtonClasses = 'waves-effect btn-flat modal-action';
    if (t.data.buttonClasses) {
      Session.set('cmButtonClasses', t.data.buttonClasses);
      Session.set('cmButtonCancelClasses', t.data.buttonClasses);
      Session.set('cmButtonSubmitClasses', t.data.buttonClasses);
    } else {
      Session.set('cmButtonClasses', defaultButtonClasses);
      Session.set('cmButtonCancelClasses', defaultButtonClasses);
      Session.set('cmButtonSubmitClasses', defaultButtonClasses);
    }
    if (t.data.buttonSubmitClasses) {
      Session.set('cmButtonSubmitClasses', t.data.buttonSubmitClasses);
    } else {
      Session.set('cmButtonSubmitClasses', defaultButtonClasses);
    }
    if (t.data.buttonCancelClasses) {
      Session.set('cmButtonCancelClasses', t.data.buttonCancelClasses);
    } else {
      Session.set('cmButtonCancelClasses', defaultButtonClasses);
    }
    if (t.data.prompt) {
      Session.set('cmPrompt', t.data.prompt);
    } else if (t.data.operation === 'remove') {
      Session.set('cmPrompt', 'Are you sure?');
    } else {
      Session.set('cmPrompt', '');
    }
    $('#afModal').openModal({
      complete: function() {
        var i, key, len, sessionKeys;
        sessionKeys = ['cmCollection', 'cmSchema', 'cmOperation', 'cmDoc', 'cmButtonHtml', 'cmFields', 'cmOmitFields', 'cmButtonContent', 'cmTitle', 'cmButtonClasses', 'cmPrompt', 'cmTemplate', 'cmLabelClass', 'cmInputColClass', 'cmPlaceholder'];
        for (i = 0, len = sessionKeys.length; i < len; i++) {
          key = sessionKeys[i];
          delete Session.keys[key];
        }
      }
    });
  }
});