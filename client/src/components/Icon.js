import React from 'react'
import classNames  from 'classnames'

import person from '../svg/person.svg'
import check from '../svg/check.svg'
import close from '../svg/close.svg'
import slideshow from '../svg/slideshow.svg'
import gps_not_fixed from '../svg/gps_not_fixed.svg'
import gps_fixed from '../svg/gps_fixed.svg'
import gps_off from '../svg/gps_off.svg'
import info_outline from '../svg/info_outline.svg'
import tag_faces from '../svg/tag_faces.svg'
import thumb_up from '../svg/thumb_up.svg'

const icons = {
    person,
    check,
    close,
    slideshow,
    gps_not_fixed,
    gps_fixed,
    gps_off,
    info_outline,
    tag_faces,
    thumb_up
};

export default class Icon extends React.Component {
    render () {
        const iconClassNames = classNames(
            'Icon',
            'Icon--' + this.props.name,
            this.props.className
        );
        return (
            <i className={iconClassNames} dangerouslySetInnerHTML={{__html: icons[this.props.name] }} />
        )
    }

}
