import {h, Fragment} from 'preact';
import {useState, useRef, useEffect, useCallback} from 'preact/hooks';
import register from 'preact-custom-element';
import {fromEvent} from 'rxjs';
import {map, skipWhile, debounceTime} from 'rxjs/operators';
import {post} from '../../utils/post';

const InputField = () => {
  const [recom, setRecom] = useState([]);
  const inputField = useRef<any>(null);

  const EventObservable = useCallback(
    (ref: any) =>
      fromEvent(ref, 'input').pipe(
        debounceTime(300),
        // extract value from event input
        map((val: any) => val.srcElement.innerHTML),
        skipWhile((value: any) => value.slice(-1) === '&nbsp;'),
        map((val: any) => val.replace('&nbsp;', ' ')),
      ),
    [],
  );

  useEffect(() => {
    const inputEvent = EventObservable(inputField.current).subscribe(async (inputValue: any) => {
      // setText(inputValue);
      const response = await post('http://localhost:8080/predict/word', {text: inputValue});
      // const response = {text: 'Damen und Herren'};
      setRecom(response);
    });

    return () => {
      inputEvent.unsubscribe();
    };
  }, [recom]);

  return (
    <Fragment>
      <div class="max-w-xl m-auto">
        <h2>
          Press <code>ctrl+space</code> to accept autosuggest
        </h2>
        <div
          id="edit"
          //@ts-ignore
          contenteditable={'true'}
          class="bg-gray-200	block w-full pl-7 pr-12 sm:text-sm sm:leading-5 h-16"
          ref={inputField}
        ></div>
        {recom.map((recommendation: any) => {
          return (
            <span class="text-gray-600">
              {recommendation.word}
              <br></br>
            </span>
          );
        })}
      </div>
    </Fragment>
  );
};

register(InputField, 'x-bert');
