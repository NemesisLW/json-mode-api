type PromiseExecutor<T> = (
  resolve: (value: T) => void,
  reject: (reason?: any) => void
) => void;

class RetryablePromise<T> extends Promise<T> {
  static async retry<T>(
    retries: number,
    executor: PromiseExecutor<T>
  ): Promise<T> {
    return new RetryablePromise<T>(executor).catch((e) => {
      console.error(`Retrying due to error: ${e}`);

      //   If we have retries left, retry the promise
      return retries > 0
        ? RetryablePromise.retry(retries - 1, executor)
        : Promise.reject(e);
    });
  }
}
