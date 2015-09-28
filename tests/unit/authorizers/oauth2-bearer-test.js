/* jshint expr:true */
import { it } from 'ember-mocha';
import { describe, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import OAuth2Bearer from 'ember-simple-auth/authorizers/oauth2-bearer';
import InternalSession from 'ember-simple-auth/internal-session';
import EphemeralStore from 'ember-simple-auth/stores/ephemeral';

describe('OAuth2BearerAuthorizer', () => {
  let authorizer;
  let block;

  beforeEach(() => {
    authorizer = OAuth2Bearer.create({
      session: InternalSession.create({ store: EphemeralStore.create() })
    });
    block = sinon.spy();
  });

  describe('#authorize', () => {
    function itDoesNotAuthorizeTheRequest() {
      it('does not call the block', () => {
        authorizer.authorize(block);

        expect(block).to.not.have.been.called;
      });
    }

    describe('when the session is authenticated', () => {
      beforeEach(() => {
        authorizer.set('session.isAuthenticated', true);
      });

      describe('when the session contains a non empty access_token', () => {
        beforeEach(() => {
          authorizer.set('session.authenticated.access_token', 'secret token!');
        });

        it('calls the block with a Bearer token header', () => {
          authorizer.authorize(block);

          expect(block).to.have.been.calledWith('Authorization', 'Bearer secret token!');
        });
      });

      describe('when the session does not contain an access_token', () => {
        beforeEach(() => {
          authorizer.set('session.authenticated.access_token', null);
        });

        itDoesNotAuthorizeTheRequest();
      });
    });

    describe('when the session is not authenticated', () => {
      beforeEach(() => {
        authorizer.set('session.isAuthenticated', false);
      });

      itDoesNotAuthorizeTheRequest();
    });
  });
});
