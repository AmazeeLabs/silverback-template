import { GitHubBackend } from 'decap-cms-backend-github';
import { Implementation } from 'decap-cms-lib-util';

import { AuthComponent } from './auth';

/**
 * Helper type to extract argument types from the `Implementation` interface.
 */
type Arg<TMethod extends keyof Implementation> =
  Implementation[TMethod] extends ((...args: any) => any) | undefined
    ? Parameters<Exclude<Implementation[TMethod], undefined>>
    : never;

/**
 * Decap backend implementation that implements its own authentication
 * layer using the silverback decap proxy and delegates everything else to
 * the stock GitHub backend.
 */
export class SilverbackBackend implements Implementation {
  /**
   * The delegate backend that this backend forwards all requests to.
   */
  protected delegate: GitHubBackend;

  /**
   * Creates a new SilverbackBackend instance.
   */
  constructor(...args: ConstructorParameters<typeof GitHubBackend>) {
    this.delegate = new GitHubBackend(...args);
  }

  /**
   * Authenticate the user using the token provided in the state.
   *
   * Authenticate against the proxy first, then delegate to the GitHub backend.
   * The proxy backend has its own Github token, so the token here does not
   * matter.
   */
  async authenticate(
    state: Arg<'authenticate'>[0],
  ): ReturnType<Implementation['authenticate']> {
    if (typeof state.token !== 'string') {
      throw new Error('Invalid token');
    }

    const result = await fetch('/_decap/auth', {
      method: 'POST',
      body: state.token,
    });

    if (result.ok) {
      await this.delegate.authenticate(state);
    } else {
      throw new Error('Invalid token');
    }
    const { email, name } = await result.json();

    return {
      token: state.token as string,
      useOpenAuthoring: true,
      login: email,
      name,
    };
  }

  /**
   * Returns the custom authentication component.
   */
  authComponent() {
    return AuthComponent;
  }

  /**
   * Destroy the current user session.
   */
  async logout() {
    await fetch('/_decap/logout', {
      method: 'POST',
    });
  }

  /**
   * Re-authenticate the user based on the provided token.
   */
  async restoreUser(user: Arg<'restoreUser'>[0]) {
    return this.authenticate(user);
  }

  /**
   * Retrieve the current token.
   */
  async getToken() {
    const result = await fetch('/_decap/status', {
      method: 'GET',
    });
    return result.ok ? (await result.json()).token : null;
  }

  /**
   * Retrieve the current status of the backend.
   * Mixes github service status with the current authentication status.
   */
  async status() {
    const ghStatus = await this.delegate.status();
    return {
      ...ghStatus,
      auth: { status: !!(await this.getToken()) },
    };
  }

  /**
   * Yes, this is a Git backend.
   */
  isGitBackend() {
    return true;
  }

  // Delegate implementations.
  // Every method from here on just forwards the call to the delegate backend.

  getEntry(...args: Arg<'getEntry'>) {
    return this.delegate.getEntry(...args);
  }
  entriesByFolder(...args: Arg<'entriesByFolder'>) {
    return this.delegate.entriesByFolder(...args);
  }

  entriesByFiles(...args: Arg<'entriesByFiles'>) {
    return this.delegate.entriesByFiles(...args);
  }

  getMediaDisplayURL(...args: Arg<'getMediaDisplayURL'>) {
    return this.delegate.getMediaDisplayURL(...args);
  }

  getMedia(...args: Arg<'getMedia'>) {
    return this.delegate.getMedia(...args);
  }

  getMediaFile(...args: Arg<'getMediaFile'>) {
    return this.delegate.getMediaFile(...args);
  }

  persistEntry(...args: Arg<'persistEntry'>) {
    return this.delegate.persistEntry(...args);
  }

  persistMedia(...args: Arg<'persistMedia'>) {
    return this.delegate.persistMedia(...args);
  }

  deleteFiles(...args: Arg<'deleteFiles'>) {
    return this.delegate.deleteFiles(...args);
  }

  unpublishedEntries() {
    return this.delegate.unpublishedEntries();
  }

  unpublishedEntry(args: {}) {
    return this.delegate.unpublishedEntry(args);
  }

  unpublishedEntryDataFile(...args: Arg<'unpublishedEntryDataFile'>) {
    return this.delegate.unpublishedEntryDataFile(...args);
  }

  unpublishedEntryMediaFile(...args: Arg<'unpublishedEntryMediaFile'>) {
    return this.delegate.unpublishedEntryMediaFile(...args);
  }

  updateUnpublishedEntryStatus(...args: Arg<'updateUnpublishedEntryStatus'>) {
    return this.delegate.updateUnpublishedEntryStatus(...args);
  }

  publishUnpublishedEntry(...args: Arg<'publishUnpublishedEntry'>) {
    return this.delegate.publishUnpublishedEntry(...args);
  }

  deleteUnpublishedEntry(...args: Arg<'deleteUnpublishedEntry'>) {
    return this.delegate.deleteUnpublishedEntry(...args);
  }

  getDeployPreview(...args: Arg<'getDeployPreview'>) {
    return this.delegate.getDeployPreview(...args);
  }

  allEntriesByFolder(...args: Arg<'allEntriesByFolder'>) {
    return this.delegate.allEntriesByFolder(...args);
  }

  traverseCursor(...args: Arg<'traverseCursor'>) {
    return this.delegate.traverseCursor(...args);
  }
}
