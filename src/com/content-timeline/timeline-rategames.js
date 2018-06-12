import {h, Component} from 'preact/preact';
import SVGIcon from 'com/svg-icon/icon';
import UIButton from 'com/ui/button/button';
import FooterButtonMinMax from 'com/content-common/common-footer-button-minmax';
import ContentItemBox from 'com/content-item/item-box';
import ContentCommonBody from 'com/content-common/common-body';
import ContentLoading from 'com/content-loading/loading';
import $Node from '../../shrub/js/node/node';

export const randomPick = (maxExclusive, n) => {
  const ret = [];
  while (ret.length < n) {
    let v = Math.floor(Math.random() * maxExclusive);
    if (ret.indexOf(v) === -1) ret.push(v);
  }
  return ret;
};

export default class TimelineRateGames extends Component {
  constructor(props) {
    super(props);
    this.state = {"expanded": true, "loading": true};
    this.handleMinMax = this.handleMinMax.bind(this);
  }

  handleMinMax() {
    this.setState({"expanded": !this.state.expanded});
  }

  componentDidMount() {
    this.getGames(this.props);
  }

  componentWillReceiveProps(nextprops) {
    const {props} = this;
    //console.log('receiveProps', props, nextprops);
    if (props.featured != nextprops.featured) this.getGames(nextprops);
  }


  getGames(props) {
    console.log('getGames', props);
    const {featured} = props;
    if (!featured) return;

    const {id} = featured;
    const methods = ['parent', 'superparent'];
    const types = ['item'];
    const subtypes = ['game'];
    const subsubtypes = 'compo+jam+craft+release';
    const tags = null;
    const more = null;
    const limit = 30;
    this.setState({'loading': true});
    $Node.GetFeed( id, methods, types, subtypes, subsubtypes, tags, more, limit )
      .then(r => {
        const l = (r.feed && r.feed.length) || 0;
        if (l === 0) {
          this.setState({
            'feed': [],
            'pick': [],
            'loaded': new Date(),
            'loading': false,
            'reshuffles': 0,
          });
        }
        else
        {
          $Node.Get(r.feed.map(elem => elem.id))
            .then(r => {
              this.setState({
                'feed': r.node,
                'pick': randomPick(l, 3),
                'loaded': new Date(),
                'loading': false,
                'reshuffles': 0,
              });
            })
            .catch(err => {
              this.setState({'error': err, 'loading': false});
            });
        }
      })
      .catch(err => {
        this.setState({'error': err, 'loading': false});
      });
  }

  render(props, {expanded, feed, pick, error, loading}) {
    if (!props.featured) return null;
    const HeaderClass = cN('content-common-header');
    const MainClass = cN('content-base', 'content-common', 'rate-games', !expanded && 'minimized');

    let Games;
    if (error) {
      Games = <div class="-warning"><SVGIcon>bug</SVGIcon><span>An error occurred while loading the games.</span></div>;
    }
    else if (loading) {
      Games = <ContentLoading />;
    }
    else if (feed.length == 0) {
      Games = <ContentCommonBody>Sorry, there are no published games yet</ContentCommonBody>;
    }
    else {
      //Continue here and don't forget all new imports
      Games = pick.map(idx => (
        <ContentItemBox
            node={r.node}
            user={props.user}
            path={props.path}
            noevent={props.noevent ? props.noevent : null}
        />
      ));
    }

    const FooterLeft = [];
    const FooterRight = [];
    FooterLeft.push(<FooterButtonMinMax onclick={this.handleMinMax} />);
    FooterRight.push((
      <UIButton class={cN("content-common-footer-button", '-all-games')} href={props.featured && `${props.featured.slug}/games`}>
          <SVGIcon>forward</SVGIcon><div> All Games</div>
      </UIButton>
    ));

    return (
      <div class={MainClass}>
        <div class={HeaderClass}><SVGIcon>gamepad</SVGIcon> <span>RATE GAMES</span></div>
                <div class="-bodies">
          <div class="-inline-if-not-minimized">
            {Games}
          </div>
        </div>
        <div class={cN('content-common-footer', (FooterLeft.length + FooterRight.length) ? '-has-items' : '')}>
            <div class="-left">
                {FooterLeft}
            </div>
            <div class="-right">
                {FooterRight}
            </div>
        </div>
      </div>
    );
  }
}
